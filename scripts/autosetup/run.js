#!/usr/bin/env node
/**
 * Hybrid autosetup (вариант A):
 *  - этот скрипт: Jira (поля + вложения + Worker URL из комментариев) + meta apply
 *    + fragment / rotate / decoy + path check + npm install
 *
 * Usage:
 *   node scripts/autosetup/run.js
 *   node scripts/autosetup/run.js --only keystore,game
 *   node scripts/autosetup/run.js --checklist-only
 *   npm run cmds
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { detectProjectEncryptionMode } = require("./detectEncryption");
const { suggestFragment } = require("./fragment");
const { resolveTaskData } = require("./resolveTaskData");
const {
  syncMetaFromJira,
  downloadJiraAssets,
  fetchJiraCloudflareWorkerUrl,
  isJiraConfigured,
} = require("./fetchJiraTask");
const {
  applyKeystore,
  applyGoogleServices,
  applyGame,
} = require("./applyAssets");
const { checkProjectPaths } = require("./checkPaths");
const { repairObfDrift } = require("./repairObfDrift");
const { rmrf, safeStat } = require("./fsUtils");
const {
  applyMetaFields,
  applyCloudflareWorkerLink,
  detectFragmentFromConstants,
} = require("./applyMeta");
const { replaceFragmentInProject } = require("./replaceFragment");
const { applyHostFragment } = require("./applyHostFragment");
const { rotateProjectEncryption } = require("./rotateEncryption");
const { generateProjectDecoys } = require("./generateDecoys");
const { stampDexVariance } = require("./stampDexVariance");
const { stampGameFragment } = require("./stampGameFragment");
const { applyColossus } = require("./applyColossus");
const { stampCfProtocol } = require("./stampCfProtocol");
const { reshuffleFragmentPositions } = require("./reshuffleFragment");
const { stampModuleRegistry } = require("./stampModuleRegistry");
const { renameNativeSurface } = require("./renameNativeSurface");
const { touchAllFiles } = require("./touchAllFiles");
const { relocateNativePackage } = require("./relocateNativePackage");
const { runFinishExtras, TAIL_STEPS } = require("./finishExtras");

const PARTIAL_STEPS = new Set([
  "meta",
  "keystore",
  "google-services",
  "game",
  "paths",
  "fragment",
  "game-stamp",
  "rotate",
  "colossus",
  "protocol",
  "reshuffle",
  "touch",
  "decoy",
  "dex",
  "native-surface",
  "npm",
  "clean-android",
  "checklist",
  "loader",
  "helpers",
  "description",
  "git-remote",
  "github-aab",
  "fb-jira",
  "repair",
]);

function parseArgs(argv) {
  const args = {
    metaPath: null,
    assetsOnly: false,
    checklistOnly: false,
    skipNpm: false,
    skipAssets: false,
    skipTail: false,
    only: null,
    list: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--meta") args.metaPath = argv[++i];
    else if (a === "--assets-only") args.assetsOnly = true;
    else if (a === "--checklist-only") args.checklistOnly = true;
    else if (a === "--skip-npm") args.skipNpm = true;
    else if (a === "--skip-assets") args.skipAssets = true;
    else if (a === "--skip-tail") args.skipTail = true;
    else if (a === "--only") args.only = String(argv[++i] || "");
    else if (a === "--list" || a === "list") args.list = true;
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function parseOnly(raw) {
  if (!raw) return null;
  const steps = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  for (const step of steps) {
    if (step === "icons") {
      throw new Error(
        "Шаг «icons» отключён: в Jira иконка PNG, добавьте mipmaps вручную"
      );
    }
    if (!PARTIAL_STEPS.has(step)) {
      throw new Error(
        `Неизвестный шаг «${step}». Доступно: ${[...PARTIAL_STEPS].join(", ")}`
      );
    }
  }
  return new Set(steps);
}

function printHelp() {
  console.log(`Autosetup (Jira)

Options:
  --meta <path>       Path to meta.json (default: <project>/meta.json)
  --only <steps>      Частичный запуск, через запятую:
                      meta, keystore, google-services, game, paths,
                      fragment, game-stamp, rotate, colossus, protocol,
                      reshuffle, touch, decoy, dex, native-surface, npm, clean-android, checklist,
                      loader, helpers, description, git-remote, github-aab, fb-jira, repair
  --assets-only       keystore+google-services+game+paths
  --skip-assets       Пропустить keystore/google-services/game
  --checklist-only    Только итог / summary
  --skip-npm          Не делать npm install в полном прогоне
  --skip-tail         Не запускать хвост: loader, helpers, описание в Jira,
                      .git из GitHub, GitHub AAB, FB hash / Class Name, проверка импортов
  --list              То же, что npm run cmds

meta.json (Jira):
  jiraBaseUrl, jiraEmail, jiraToken, jiraIssue
  → appName / packageName + keystore / google-services / *_source.zip
  → комментарии задачи: Worker URL → li{fragment}nk (шифруется текущим cipher)
  → после game: штамп fragment в Layouts/Game (имена + код), иначе fragment/split там пустые
  → после fragment: namespace и пакет Main* → com.{hostFragment} (старый суффикс abpp снимается)
    (уникален на jiraIssue+packageName; иначе клоны шаблона делят один Class Name)
  → ModuleRegistry без фрагмента переименовывается в S{fragment}ModuleRegistry,
    дальше его двигают fragment replace и reshuffle
  → NativeModule (класс, getName, @ReactMethod и вызовы в services/) получают
    новые имена на каждом прогоне; R8 их не прячет

Примеры:
  node scripts/autosetup/run.js --only keystore,game
  node scripts/autosetup/run.js --only game-stamp,decoy
  node scripts/autosetup/run.js --only fragment,rotate
  npm run cmds
`);
}

async function loadMeta(metaPath) {
  const raw = await fs.readFile(metaPath, "utf8");
  return JSON.parse(raw);
}

/** Keys resolved at runtime — never persist into meta.json (portable between projects). */
const RUNTIME_ONLY_META_KEYS = ["encryptionResolved", "fragmentTo"];

async function saveMeta(metaPath, meta) {
  const toSave = { ...meta };
  for (const key of RUNTIME_ONLY_META_KEYS) {
    delete toSave[key];
  }
  await fs.writeFile(metaPath, `${JSON.stringify(toSave, null, 2)}\n`, "utf8");
}

function needsAutoEncryption(value) {
  if (value == null) return true;
  const v = String(value).trim().toLowerCase();
  return v === "" || v === "auto" || v === "detect";
}

function needsAutoFragment(value) {
  if (value == null) return true;
  const v = String(value).trim().toLowerCase();
  return v === "" || v === "auto" || v === "null" || v === "detect";
}

async function resolveEncryption(rootPath, meta) {
  if (!needsAutoEncryption(meta.encryption)) {
    return { mode: String(meta.encryption).trim().toLowerCase(), auto: false };
  }
  const detected = await detectProjectEncryptionMode(rootPath);
  if (!detected) {
    throw new Error(
      "Не удалось автоопределить encryption (нет import ./typex|./ty*pex|./xtea|./xt*ea|./fernet|./rc4|./rc6|./gost|./blowfish|./tripledes|./ascon|./rot47 в services/*toService.ts / *Crypto*Service.ts)"
    );
  }
  return { mode: detected, auto: true };
}

/** In-memory only — does not change meta.encryption on disk. */
function applyEncryptionToMeta(meta, enc) {
  meta.encryptionResolved = enc.mode;
}

function printWarningReport(warnings) {
  if (!warnings || warnings.length === 0) {
    console.log("Предупреждения: нет");
    return;
  }
  console.log(`Предупреждения (${warnings.length}):`);
  for (const item of warnings) {
    console.log(`  - ${item.title}: ${item.reason}`);
  }
}

function printDoneSummary(meta, { rootPath, encryptionMode, warnings = [] }) {
  console.log("\n========== Autosetup: готово ==========");
  console.log(`encryption: ${encryptionMode}`);
  console.log(`jiraIssue: ${meta.jiraIssue || "(n/a)"}`);
  console.log(`appName: ${meta.appName}`);
  console.log(`packageName: ${meta.packageName}`);
  console.log(`version: ${meta.versionCode} / ${meta.versionName}`);
  console.log(`fragmentTo: ${meta.fragmentTo}`);
  console.log(`hostFragment: ${meta.hostFragment || "(n/a)"}`);
  console.log(`project: ${rootPath}`);
  printWarningReport(warnings);
  console.log("=======================================\n");
}

async function cleanAndroidBuilds(rootPath) {
  const targets = [
    path.join(rootPath, "android", "build"),
    path.join(rootPath, "android", "app", "build"),
  ];
  const deleted = [];
  const missing = [];
  for (const target of targets) {
    if (await safeStat(target)) {
      await rmrf(target);
      deleted.push(path.relative(rootPath, target).replace(/\\/g, "/"));
    } else {
      missing.push(path.relative(rootPath, target).replace(/\\/g, "/"));
    }
  }
  return {
    ok: true,
    details:
      `удалено: ${deleted.join(", ") || "—"}` +
      (missing.length ? `; не было: ${missing.join(", ")}` : ""),
  };
}

async function runNpmInstall(rootPath) {
  const result = spawnSync("npm install", {
    cwd: rootPath,
    stdio: "inherit",
    shell: true,
    windowsHide: true,
  });
  if (result.error) {
    throw new Error(`npm install failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`npm install failed with exit ${result.status}`);
  }
  return { ok: true, details: "npm install ok" };
}

async function prepareMeta(
  rootPath,
  metaPath,
  { requireMetaFields, allowSuggestFragment = true } = {}
) {
  const meta = await loadMeta(metaPath);
  if (requireMetaFields) {
    const required = ["appName", "packageName", "versionCode", "versionName"];
    for (const key of required) {
      if (meta[key] == null || meta[key] === "") {
        throw new Error(`meta.json: отсутствует поле «${key}»`);
      }
    }
  }

  const enc = await resolveEncryption(rootPath, meta);
  applyEncryptionToMeta(meta, enc);
  if (enc.auto) {
    console.log(
      `[autosetup] encryption auto-detected → ${enc.mode} (не пишем в meta.json)`
    );
  } else {
    console.log(`[autosetup] encryption from meta → ${enc.mode}`);
  }

  if (needsAutoFragment(meta.fragmentTo)) {
    // Only invent a new fragment when the fragment step will actually rename.
    // rotate/decoy alone must keep the live constants fragment.
    if (allowSuggestFragment !== false) {
      meta.fragmentTo = suggestFragment(rootPath);
      console.log(
        `[autosetup] fragmentTo suggested → ${meta.fragmentTo} (не пишем в meta.json)`
      );
    } else {
      meta.fragmentTo = await detectFragmentFromConstants(rootPath);
      console.log(
        `[autosetup] fragmentTo from project → ${meta.fragmentTo || "(empty)"}`
      );
    }
  } else {
    console.log(`[autosetup] fragmentTo from meta → ${meta.fragmentTo}`);
  }

  // Runtime fields stay in memory only — meta.json stays portable across projects.
  return { meta, enc };
}

async function ensureMetaFromJira(meta, metaPath) {
  if (!isJiraConfigured(meta)) return meta;
  await syncMetaFromJira(meta, metaPath, { saveMeta });
  return loadMeta(metaPath);
}

async function resolveAssets(meta) {
  if (isJiraConfigured(meta)) {
    const jira = await downloadJiraAssets(meta);
    return { task: jira.task, cleanup: jira.cleanup };
  }

  if (!meta.newTaskData) {
    throw new Error(
      "meta.json: укажите jiraToken + jiraIssue (+ jiraEmail), либо newTaskData как fallback"
    );
  }

  const newTaskData = path.resolve(meta.newTaskData);
  console.log(`[autosetup] NewTaskData (fallback): ${newTaskData}`);
  const task = await resolveTaskData(newTaskData);
  console.log(`[autosetup] keystore: ${path.basename(task.keystoreTar)}`);
  console.log(`[autosetup] google-services: ${path.basename(task.googleServices)}`);
  console.log(`[autosetup] source: ${path.basename(task.sourceZip)}`);
  return { task, cleanup: async () => {} };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.list) {
    require("./listCommands");
    return;
  }
  if (args.help) {
    printHelp();
    return;
  }

  const only = parseOnly(args.only);
  const rootPath = path.resolve(__dirname, "..", "..");
  const metaPath = path.resolve(rootPath, args.metaPath || "meta.json");

  console.log(`[autosetup] project: ${rootPath}`);
  console.log(`[autosetup] meta: ${metaPath}`);

  const doMeta = only ? only.has("meta") : true;
  let doKeystore = only ? only.has("keystore") : true;
  let doGs = only ? only.has("google-services") : true;
  let doGame = only ? only.has("game") : true;
  const doPaths = only ? only.has("paths") : true;
  const doFragment = only ? only.has("fragment") : !args.assetsOnly;
  const doGameStamp = only
    ? only.has("game-stamp") || only.has("fragment") || only.has("game") || only.has("decoy")
    : !args.assetsOnly || doGame;
  const doRotate = only ? only.has("rotate") : !args.assetsOnly;
  const doColossus = only ? only.has("colossus") : !args.assetsOnly;
  const doProtocol = only ? only.has("protocol") : !args.assetsOnly;
  const doReshuffle = only ? only.has("reshuffle") || only.has("fragment") : !args.assetsOnly;
  const doTouch = only ? only.has("touch") : !args.assetsOnly;
  const doDecoy = only ? only.has("decoy") : !args.assetsOnly;
  const doDex = only ? only.has("dex") || only.has("decoy") : !args.assetsOnly;
  const doNativeSurface = only
    ? only.has("native-surface") || only.has("dex") || only.has("decoy") || only.has("fragment")
    : !args.assetsOnly;
  const doClean = only ? only.has("clean-android") : !args.assetsOnly;
  const doNpm = only
    ? only.has("npm")
    : !args.assetsOnly && !args.skipNpm;
  const doSummary = only
    ? only.has("checklist")
    : args.checklistOnly || !args.assetsOnly;

  if (args.skipAssets) {
    doKeystore = false;
    doGs = false;
    doGame = false;
    console.log("[autosetup] --skip-assets: keystore/google-services/game skipped");
  }

  let cleanup = async () => {};

  try {
    if (args.checklistOnly) {
      let meta = await loadMeta(metaPath);
      if (isJiraConfigured(meta)) {
        meta = await ensureMetaFromJira(meta, metaPath);
      }
      const { enc } = await prepareMeta(rootPath, metaPath, {
        requireMetaFields: true,
      });
      meta = await loadMeta(metaPath);
      printDoneSummary(meta, { rootPath, encryptionMode: enc.mode });
      return;
    }

    const needAssets = doKeystore || doGs || doGame;
    const needJiraFields =
      doMeta || needAssets || doSummary || doFragment || (!only && true);

    let meta = await loadMeta(metaPath).catch(() => ({}));
    let enc = null;
    let task = null;

    if (needJiraFields && isJiraConfigured(meta)) {
      meta = await ensureMetaFromJira(meta, metaPath);
    }

    const needPrepare =
      doMeta ||
      doKeystore ||
      doGs ||
      doGame ||
      doGameStamp ||
      doFragment ||
      doRotate ||
      doColossus ||
      doProtocol ||
      doReshuffle ||
      doDecoy ||
      doSummary;

    if (needPrepare) {
      const prepared = await prepareMeta(rootPath, metaPath, {
        requireMetaFields: doMeta || doFragment || doSummary || !only,
        allowSuggestFragment: doFragment || (!only && !args.assetsOnly),
      });
      meta = prepared.meta;
      enc = prepared.enc;
    }

    if (only && only.size === 1 && only.has("checklist")) {
      printDoneSummary(meta, { rootPath, encryptionMode: enc.mode });
      return;
    }

    if (doMeta) {
      console.log("[autosetup] meta fields...");
      let cloudflareWorkerUrl = null;
      if (isJiraConfigured(meta)) {
        const cf = await fetchJiraCloudflareWorkerUrl(meta);
        if (cf.ok) {
          cloudflareWorkerUrl = cf.url;
          console.log(
            `[autosetup] from Jira comments: cloudflareWorkerUrl=${cf.url}`
          );
        } else {
          console.warn(`[warn] Cloudflare Worker URL: ${cf.details}`);
        }
      }
      const metaResults = await applyMetaFields(rootPath, meta, {
        cloudflareWorkerUrl,
        encryptionMode: enc?.mode || meta.encryptionResolved || meta.encryption,
      });
      for (const [name, result] of metaResults) {
        console.log(`  - ${name}: ${result.details}${result.ok ? "" : " (warn)"}`);
      }
    }

    if (needAssets) {
      const resolved = await resolveAssets(meta);
      task = resolved.task;
      cleanup = resolved.cleanup;
    }

    const earlySteps = [];
    if (doKeystore) {
      earlySteps.push(["keystore", () => applyKeystore(rootPath, task.keystoreTar)]);
    }
    if (doGs) {
      earlySteps.push([
        "google-services",
        () => applyGoogleServices(rootPath, task.googleServices),
      ]);
    }
    if (doGame) earlySteps.push(["game", () => applyGame(rootPath, task.sourceZip)]);

    for (const [name, fn] of earlySteps) {
      process.stdout.write(`[autosetup] ${name}... `);
      const result = await fn();
      console.log(result.details || "ok");
    }

    if (doGameStamp) {
      const stampFrag =
        (await detectFragmentFromConstants(rootPath)) ||
        meta.fragmentTo ||
        "";
      process.stdout.write("[autosetup] game-stamp (Layouts/Game)... ");
      const stamp = await stampGameFragment(rootPath, { fragment: stampFrag });
      console.log(stamp.details || "ok");
      if (!stamp.ok) {
        throw new Error(stamp.details);
      }
    }

    let check = { ok: true, checkedFiles: 0, problems: [] };
    if (doPaths) {
      process.stdout.write("[autosetup] path-check... ");
      check = await checkProjectPaths(rootPath);
      if (check.ok) {
        console.log(`ok (${check.checkedFiles} files)`);
      } else {
        console.log(`FOUND ${check.problems.length} broken refs:`);
        for (const p of check.problems) {
          console.log(`  - ${p.file} → ${p.ref}`);
        }
      }
    }

    if (doFragment) {
      const fromFragment = await detectFragmentFromConstants(rootPath);
      const toFragment = meta.fragmentTo;
      process.stdout.write(
        `[autosetup] fragment ${fromFragment || "?"} → ${toFragment}... `
      );
      const result = await replaceFragmentInProject(rootPath, fromFragment, toFragment);
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }

      const projectFragment =
        (await detectFragmentFromConstants(rootPath)) || toFragment;
      process.stdout.write("[autosetup] activity host... ");
      const hostResult = await applyHostFragment(rootPath, meta, projectFragment);
      console.log(hostResult.details || "ok");
      if (!hostResult.ok) {
        throw new Error(hostResult.details);
      }
      process.stdout.write("[autosetup] native package... ");
      const nativePkg = await relocateNativePackage(
        rootPath,
        projectFragment,
        `com.${meta.hostFragment}`
      );
      console.log(nativePkg.details || "ok");
      await saveMeta(metaPath, meta);
    }

    if (doReshuffle) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] module registry... ");
      const registry = await stampModuleRegistry(rootPath, { fragment });
      console.log(registry.details || "ok");
      if (!registry.ok) {
        throw new Error(registry.details);
      }
      process.stdout.write("[autosetup] reshuffle fragment positions... ");
      const result = await reshuffleFragmentPositions(rootPath, fragment);
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doColossus) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] colossus cipher + seed... ");
      const result = await applyColossus(rootPath, { fragment, meta });
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
      enc = { mode: "colossus", auto: false };
      meta.encryption = "colossus";
      meta.encryptionResolved = "colossus";
      await saveMeta(metaPath, meta);

      // Seed just rotated. The li*nk hex was encrypted with the previous key
      // (and fragment replace can change that key), so rewrite it from Jira
      // under the credentials now on disk — before rotate tries to decrypt it.
      if (isJiraConfigured(meta)) {
        process.stdout.write("[autosetup] worker url (new colossus seed)... ");
        const worker = await fetchJiraCloudflareWorkerUrl(meta);
        if (!worker.ok) {
          console.warn(worker.details || "не найден");
        } else {
          const liveFragment = await detectFragmentFromConstants(rootPath);
          const relink = await applyCloudflareWorkerLink(
            rootPath,
            worker.url,
            liveFragment,
            "colossus",
            meta
          );
          console.log(relink.details || "ok");
          if (!relink.ok) {
            throw new Error(relink.details);
          }
        }
      }
    }

    if (doProtocol) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] cloudflare protocol... ");
      const result = await stampCfProtocol(rootPath, { fragment });
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doRotate) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      const rotateMode = enc?.mode || meta.encryptionResolved || meta.encryption || "colossus";
      process.stdout.write(
        `[autosetup] rotate encryption (${rotateMode})... `
      );
      const result = await rotateProjectEncryption(rootPath, {
        mode: rotateMode,
        fragment,
        meta,
      });
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doDecoy) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] decoy files... ");
      const result = await generateProjectDecoys(rootPath, { fragment, meta });
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doDex) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] dex variance... ");
      const result = await stampDexVariance(rootPath, { fragment });
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doNativeSurface) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] native surface... ");
      const result = await renameNativeSurface(rootPath, { fragment });
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doPaths || doReshuffle || doGameStamp) {
      const fragment =
        meta.fragmentTo || (await detectFragmentFromConstants(rootPath));
      process.stdout.write("[autosetup] repair platform members + duplicate parts... ");
      const repaired = await repairObfDrift(rootPath, { fragment });
      console.log(repaired.details || "ok");
    }

    if (doPaths) {
      process.stdout.write("[autosetup] path-check (final)... ");
      check = await checkProjectPaths(rootPath);
      if (check.ok) {
        console.log(`ok (${check.checkedFiles} files)`);
      } else {
        console.log(`FOUND ${check.problems.length} broken refs:`);
        for (const p of check.problems) {
          console.log(`  - ${p.file} → ${p.ref}`);
        }
      }
    }

    if (doTouch) {
      process.stdout.write("[autosetup] recreate files (timestamps)... ");
      const result = await touchAllFiles(rootPath);
      console.log(result.details || "ok");
      if (!result.ok) {
        throw new Error(result.details);
      }
    }

    if (doClean) {
      process.stdout.write("[autosetup] clean-android... ");
      const result = await cleanAndroidBuilds(rootPath);
      console.log(result.details || "ok");
    }

    if (doNpm && (only || (!args.assetsOnly && meta?.npmInstall !== false))) {
      if (
        only?.has("npm") ||
        (!only && !args.assetsOnly && !args.skipNpm && meta?.npmInstall !== false)
      ) {
        console.log("[autosetup] npm install...");
        await runNpmInstall(rootPath);
      }
    } else if (
      !only &&
      (args.assetsOnly || args.skipNpm || meta?.npmInstall === false)
    ) {
      console.log("[autosetup] npm install skipped");
    }

    const tailMeta = await loadMeta(metaPath).catch(() => meta);
    const doTail = only
      ? TAIL_STEPS.some((step) => only.has(step))
      : !args.assetsOnly && !args.checklistOnly && !args.skipTail && tailMeta?.skipTail !== true;
    let tailWarnings = [];
    if (doTail) {
      const tail = await runFinishExtras(rootPath, tailMeta || meta, { only: only || null });
      tailWarnings = tail.warnings || [];
    }

    if (doSummary && !args.assetsOnly) {
      if (!enc) {
        const prepared = await prepareMeta(rootPath, metaPath, {
          requireMetaFields: true,
        });
        meta = prepared.meta;
        enc = prepared.enc;
      }
      printDoneSummary(meta, {
        rootPath,
        encryptionMode: enc.mode,
        warnings: tailWarnings,
      });
    } else if (tailWarnings.length) {
      console.log("");
      printWarningReport(tailWarnings);
    }

    if (doPaths && !check.ok) {
      process.exitCode = 2;
    }
  } finally {
    await cleanup().catch(() => {});
  }
}

main().catch((err) => {
  console.error(`[autosetup] ERROR: ${err.message || err}`);
  process.exit(1);
});
