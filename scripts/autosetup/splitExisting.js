/**
 * Split existing (non-decoy) sources into companion Part files
 * without changing public APIs or business control flow.
 *
 * TypeScript: dummy helpers identified via `void helper(` / `void Type.helper(`
 *   are moved to HostPart01.ts … and imported back.
 * Android: all-static Java helpers become thin facades over Part classes;
 *   self-contained Kotlin `private fun` (no this / react context) move to objects.
 *
 * Idempotent: skip hosts that already have autosetup-split markers.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");

const SPLIT_MARKER = "/* autosetup-split:v1 */";
const SPLIT_BEGIN = "// autosetup-split-begin";
const SPLIT_END = "// autosetup-split-end";
const MIN_PARTS = 1;
const MAX_PARTS = 3;
/** Chance to leave an eligible host unsplit (0.55 = keep most files whole). */
const SPLIT_KEEP_WHOLE_CHANCE = 0.55;
/** Layouts/Game: fewer parts and higher keep-whole chance than services. */
const MIN_PARTS_GAME = 1;
const MAX_PARTS_GAME = 2;
const SPLIT_KEEP_WHOLE_CHANCE_GAME = 0.7;
const SKIP_TS_NAME = /(?:deviceBlockLists\.generated|DecoyHub)/i;
/** Cipher modules must stay whole — helper/rotate scripts expect a single xt*ea|xtea|ty*pex|… file. */
const SKIP_CIPHER_TS =
  /^(?:xtea|xt[A-Za-z0-9]*ea|typex|ty[A-Za-z0-9]*pex|bacon|ba[A-Za-z0-9]*con|bombe|bo[A-Za-z0-9]*mbe|fernet|gost|rc4|rc6|blowfish|tripledes|ascon|rot47)$/i;
/** Risky Game hosts: asset barrel and theme tokens stay whole. */
const SKIP_GAME_TS =
  /(?:^|[\\/])(?:assets[\\/]index|theme|th[A-Za-z0-9]*eme)$/i;
const SKIP_ANDROID_NAME =
  /^(MainActivity|MainApplication|.*Package|.*ModuleRegistry)\./;

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walkFiles(rootDir, { exts = null } = {}) {
  const files = [];
  if (!(await safeStat(rootDir))) return files;
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (exts && !exts.has(ext)) continue;
      files.push(full);
    }
  }
  await walk(rootDir);
  return files;
}

function isDecoySource(src) {
  return src.includes("autosetup-decoy:v1");
}

function isSplitPartSource(src) {
  return src.includes("autosetup-split:v1");
}

function isAlreadySplitHost(src) {
  return src.includes(SPLIT_BEGIN);
}

function skipNonCode(src, i) {
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const n1 = src[i + 1];
    if (c === " " || c === "\t" || c === "\r" || c === "\n") {
      i += 1;
      continue;
    }
    if (c === "/" && n1 === "/") {
      i += 2;
      while (i < n && src[i] !== "\n") i += 1;
      continue;
    }
    if (c === "/" && n1 === "*") {
      i += 2;
      while (i + 1 < n && !(src[i] === "*" && src[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c;
      i += 1;
      while (i < n) {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === q) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    if (c === "`") {
      i += 1;
      while (i < n) {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "`") {
          i += 1;
          break;
        }
        if (src[i] === "$" && src[i + 1] === "{") {
          i += 2;
          let depth = 1;
          while (i < n && depth > 0) {
            i = skipNonCode(src, i);
            if (i >= n) break;
            if (src[i] === "{") {
              depth += 1;
              i += 1;
            } else if (src[i] === "}") {
              depth -= 1;
              i += 1;
            } else {
              i += 1;
            }
          }
          continue;
        }
        i += 1;
      }
      continue;
    }
    break;
  }
  return i;
}

function matchBrackets(src, openIdx) {
  const open = src[openIdx];
  const close = open === "(" ? ")" : open === "{" ? "}" : open === "[" ? "]" : null;
  if (!close) return -1;
  let depth = 0;
  let i = openIdx;
  const n = src.length;
  while (i < n) {
    i = skipNonCode(src, i);
    if (i >= n) return -1;
    if (src[i] === open) {
      depth += 1;
      i += 1;
      continue;
    }
    if (src[i] === close) {
      depth -= 1;
      i += 1;
      if (depth === 0) return i - 1;
      continue;
    }
    i += 1;
  }
  return -1;
}

function findBodyOpen(src, afterParenClose) {
  let i = skipNonCode(src, afterParenClose + 1);
  if (src[i] === ":") {
    i += 1;
    while (i < src.length) {
      i = skipNonCode(src, i);
      if (i >= src.length) return -1;
      if (src[i] === "{") return i;
      if (src[i] === ";") return -1;
      i += 1;
    }
    return -1;
  }
  return src[i] === "{" ? i : -1;
}

function collectVoidHelperNames(src) {
  const names = new Set();
  const re = /void\s+(?:(?:this|[A-Za-z_$][\w$]*)\.)?([A-Za-z_$][\w$]*)\s*\(/g;
  let m;
  while ((m = re.exec(src))) names.add(m[1]);
  return names;
}

function looksUnsafeHelper(body) {
  return (
    /\bawait\b/.test(body) ||
    /\bfetch\s*\(/.test(body) ||
    /\bNativeModules\b/.test(body) ||
    /\bAsyncStorage\b/.test(body)
  );
}

function rewriteHelperRefs(src, helperNames, classNames) {
  let out = src;
  const names = [...helperNames].sort((a, b) => b.length - a.length);
  const classAlt = classNames.map(escapeRegExp).join("|") || "this";
  for (const name of names) {
    const re = new RegExp(
      `\\b(?:this|${classAlt})\\.${escapeRegExp(name)}\\b`,
      "g"
    );
    out = out.replace(re, name);
  }
  return out;
}

function stripLeadingIndent(text, spaces) {
  const re = new RegExp(`^[ \\t]{0,${spaces}}`, "gm");
  return text.replace(re, "");
}

function methodToExportedFunction(text) {
  let t = text.trim();
  t = t.replace(/^(?:public|private|protected)\s+/, "");
  t = t.replace(/^static\s+/, "");
  t = t.replace(/^async\s+/, "");
  if (!t.startsWith("function ")) t = `function ${t}`;
  if (!t.startsWith("export ")) t = `export ${t}`;
  return t;
}

function findTsDeclarations(src) {
  const decls = [];
  const n = src.length;
  let i = 0;
  let brace = 0;
  const classStack = [];

  while (i < n) {
    i = skipNonCode(src, i);
    if (i >= n) break;

    if (brace === 0) {
      const classMatch = src
        .slice(i)
        .match(/^(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)\b/);
      if (classMatch) {
        i += classMatch[0].length;
        i = skipNonCode(src, i);
        while (i < n && src[i] !== "{") {
          i += 1;
          i = skipNonCode(src, i);
        }
        if (src[i] === "{") {
          classStack.push({ name: classMatch[1], bodyDepth: brace + 1 });
          brace += 1;
          i += 1;
          continue;
        }
      }

      const fnMatch = src
        .slice(i)
        .match(/^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
      if (fnMatch) {
        const start = i;
        const parenOpen = i + fnMatch[0].length - 1;
        const parenClose = matchBrackets(src, parenOpen);
        if (parenClose < 0) {
          i += 1;
          continue;
        }
        const bodyOpen = findBodyOpen(src, parenClose);
        if (bodyOpen < 0) {
          i += 1;
          continue;
        }
        const bodyClose = matchBrackets(src, bodyOpen);
        if (bodyClose < 0) {
          i += 1;
          continue;
        }
        decls.push({
          kind: "function",
          name: fnMatch[1],
          exported: /^export\s/.test(fnMatch[0]),
          isAsync: /\basync\s+function\b/.test(fnMatch[0]),
          className: null,
          start,
          end: bodyClose + 1,
          bodyStart: bodyOpen,
          bodyEnd: bodyClose + 1,
        });
        i = bodyClose + 1;
        continue;
      }
    }

    const cls = classStack.length ? classStack[classStack.length - 1] : null;
    if (cls && brace === cls.bodyDepth) {
      const methMatch = src
        .slice(i)
        .match(
          /^(?:public|private|protected)?\s*(?:static\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/
        );
      if (
        methMatch &&
        !/^(if|for|while|switch|catch|function|return|typeof|new|void)$/.test(
          methMatch[1]
        )
      ) {
        const start = i;
        const parenOpen = i + methMatch[0].length - 1;
        const parenClose = matchBrackets(src, parenOpen);
        if (parenClose >= 0) {
          const bodyOpen = findBodyOpen(src, parenClose);
          if (bodyOpen >= 0) {
            const bodyClose = matchBrackets(src, bodyOpen);
            if (bodyClose >= 0) {
              decls.push({
                kind: "method",
                name: methMatch[1],
                exported: false,
                isAsync: /\basync\s+/.test(methMatch[0]),
                className: cls.name,
                start,
                end: bodyClose + 1,
                bodyStart: bodyOpen,
                bodyEnd: bodyClose + 1,
              });
              i = bodyClose + 1;
              continue;
            }
          }
        }
      }
    }

    if (src[i] === "{") {
      brace += 1;
      i += 1;
      continue;
    }
    if (src[i] === "}") {
      brace -= 1;
      if (classStack.length && brace < classStack[classStack.length - 1].bodyDepth) {
        classStack.pop();
      }
      i += 1;
      continue;
    }
    i += 1;
  }
  return decls;
}

function connectedGroups(helpers) {
  const names = helpers.map((h) => h.name);
  const parent = new Map(names.map((n) => [n, n]));
  function find(x) {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  }
  function union(a, b) {
    const pa = find(a);
    const pb = find(b);
    if (pa !== pb) parent.set(pa, pb);
  }
  for (const h of helpers) {
    for (const other of names) {
      if (other === h.name) continue;
      if (new RegExp(`\\b${escapeRegExp(other)}\\b`).test(h.text)) union(h.name, other);
    }
  }
  const groups = new Map();
  for (const h of helpers) {
    const root = find(h.name);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(h);
  }
  return [...groups.values()];
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickPartCount(itemCount, minParts = MIN_PARTS, maxParts = MAX_PARTS) {
  const max = Math.min(maxParts, Math.max(1, itemCount));
  const min = Math.min(minParts, max);
  return randomInt(min, max);
}

/** Pack connected groups into parts. Groups stay together; empty bins dropped. */
function packIntoParts(groups, partCount, maxParts = MAX_PARTS) {
  const n = Math.max(1, Math.min(maxParts, partCount));
  const bins = Array.from({ length: n }, () => []);
  const sizes = Array(n).fill(0);
  const ordered = [...groups].sort((a, b) => b.length - a.length);
  for (const group of ordered) {
    let idx = 0;
    for (let i = 1; i < n; i++) {
      if (sizes[i] < sizes[idx]) idx = i;
    }
    bins[idx].push(...group);
    sizes[idx] += group.length;
  }
  return bins.filter((b) => b.length > 0);
}

function insertSplitImports(src, importLines) {
  const block = `${SPLIT_BEGIN}\n${importLines.join("\n")}\n${SPLIT_END}\n`;
  const stripped = src.replace(
    new RegExp(
      `\\n?${escapeRegExp(SPLIT_BEGIN)}[\\s\\S]*?${escapeRegExp(SPLIT_END)}\\n?`,
      "g"
    ),
    "\n"
  );
  const importLineRe =
    /^(?:import\s[\s\S]*?from\s*['"][^'"]+['"]\s*;?|import\s+['"][^'"]+['"]\s*;?)\s*$/gm;
  let lastImportEnd = -1;
  let m;
  while ((m = importLineRe.exec(stripped))) {
    lastImportEnd = m.index + m[0].length;
  }
  if (lastImportEnd >= 0) {
    const nl = stripped[lastImportEnd] === "\n" ? "" : "\n";
    return `${stripped.slice(0, lastImportEnd)}${nl}${block}${stripped.slice(lastImportEnd)}`;
  }
  return `${block}\n${stripped}`;
}

/** Prefer same-dir relative import; works for services/ and services/hooks/. */
function partImportPath(hostPath, partBase) {
  return `./${partBase}`;
}

function shouldSkipGameTs(filePath) {
  const noExt = filePath.replace(/\\/g, "/").replace(/\.tsx?$/i, "");
  return SKIP_GAME_TS.test(noExt);
}

/**
 * @param {string} filePath
 * @param {{ minParts?: number, maxParts?: number, keepWholeChance?: number }} [options]
 */
async function splitTsFile(filePath, options = {}) {
  const minParts = options.minParts ?? MIN_PARTS;
  const maxParts = options.maxParts ?? MAX_PARTS;
  const keepWholeChance = options.keepWholeChance ?? SPLIT_KEEP_WHOLE_CHANCE;

  const src = await fs.readFile(filePath, "utf8");
  if (isDecoySource(src) || isSplitPartSource(src) || isAlreadySplitHost(src)) {
    return null;
  }
  const base = path.basename(filePath, path.extname(filePath));
  if (SKIP_TS_NAME.test(base) || SKIP_CIPHER_TS.test(base) || /Part\d+$/.test(base)) {
    return null;
  }

  const voidNames = collectVoidHelperNames(src);
  if (voidNames.size === 0) return null;

  const decls = findTsDeclarations(src);
  const classNames = [
    ...new Set(decls.filter((d) => d.className).map((d) => d.className)),
  ];
  const helpers = [];
  for (const d of decls) {
    if (!voidNames.has(d.name)) continue;
    if (d.exported || d.isAsync) continue;
    const text = src.slice(d.start, d.end);
    const body = src.slice(d.bodyStart, d.bodyEnd);
    if (looksUnsafeHelper(body)) continue;
    helpers.push({ ...d, text, body });
  }
  if (helpers.length < 2) return null;
  if (Math.random() < keepWholeChance) return null;

  const helperNames = new Set(helpers.map((h) => h.name));
  const packed = packIntoParts(
    connectedGroups(helpers),
    pickPartCount(helpers.length, minParts, maxParts),
    maxParts
  );
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const importLines = [];
  const partFiles = [];

  for (let p = 0; p < packed.length; p++) {
    const chunk = packed[p];
    const partBase = `${base}Part${String(p + 1).padStart(2, "0")}`;
    const partPath = path.join(dir, `${partBase}${ext}`);
    const fns = chunk.map((h) => {
      let fn = methodToExportedFunction(h.text);
      fn = rewriteHelperRefs(fn, helperNames, classNames.length ? classNames : ["this"]);
      fn = stripLeadingIndent(fn, 2);
      return fn.trim();
    });
    await fs.writeFile(partPath, `${SPLIT_MARKER}\n\n${fns.join("\n\n")}\n`, "utf8");
    partFiles.push(partPath);
    importLines.push(
      `import { ${chunk.map((h) => h.name).join(", ")} } from '${partImportPath(filePath, partBase)}';`
    );
  }

  let next = src;
  const removeRanges = helpers
    .map((h) => ({ start: h.start, end: h.end }))
    .sort((a, b) => b.start - a.start);
  for (const r of removeRanges) {
    let from = r.start;
    let to = r.end;
    while (from > 0 && (next[from - 1] === " " || next[from - 1] === "\t")) from -= 1;
    if (next[to] === "\r") to += 1;
    if (next[to] === "\n") to += 1;
    next = next.slice(0, from) + next.slice(to);
  }

  next = rewriteHelperRefs(next, helperNames, classNames.length ? classNames : ["this"]);
  next = next.replace(/\n{3,}/g, "\n\n");
  next = insertSplitImports(next, importLines);
  await fs.writeFile(filePath, next, "utf8");
  return { host: filePath, parts: partFiles, helpers: helpers.length };
}

function parseJavaStaticClass(src) {
  const pkgMatch = src.match(/^\s*package\s+([\w.]+)\s*;/m);
  const classMatch = src.match(/\bclass\s+([A-Za-z_]\w*)\s*\{/);
  if (!classMatch) return null;
  if (/\bextends\s+\w+/.test(src.slice(Math.max(0, classMatch.index - 120), classMatch.index))) {
    return null;
  }
  const className = classMatch[1];
  const classBodyOpen = classMatch.index + classMatch[0].length - 1;
  const classBodyClose = matchBrackets(src, classBodyOpen);
  if (classBodyClose < 0) return null;

  const fields = [];
  const methods = [];
  let i = classBodyOpen + 1;
  while (i < classBodyClose) {
    i = skipNonCode(src, i);
    if (i >= classBodyClose) break;
    const slice = src.slice(i, classBodyClose);
    const methodMatch = slice.match(
      /^(?:public|private|protected)\s+static\s+(?:final\s+)?([\w.<>,\[\]]+)\s+([A-Za-z_]\w*)\s*\(/
    );
    const fieldMatch = slice.match(
      /^(?:public|private|protected)?\s*static\s+(?:final\s+)?[\w.<>,\[\]\s]+?\s+([A-Za-z_]\w*)\s*(?:=|;)/
    );
    if (methodMatch && methodMatch.index === 0) {
      const parenOpen = i + methodMatch[0].length - 1;
      const parenClose = matchBrackets(src, parenOpen);
      if (parenClose < 0) {
        i += 1;
        continue;
      }
      const bodyOpen = findBodyOpen(src, parenClose);
      if (bodyOpen < 0) {
        i += 1;
        continue;
      }
      const bodyClose = matchBrackets(src, bodyOpen);
      if (bodyClose < 0) {
        i += 1;
        continue;
      }
      methods.push({
        start: i,
        end: bodyClose + 1,
        name: methodMatch[2],
        returnType: methodMatch[1].trim(),
        signature: src.slice(i, bodyOpen + 1),
        paramsRaw: src.slice(parenOpen + 1, parenClose),
        body: src.slice(bodyOpen, bodyClose + 1),
        isVoid: /^\s*void\b/.test(methodMatch[1]),
      });
      i = bodyClose + 1;
      continue;
    }
    if (fieldMatch && fieldMatch.index === 0) {
      let j = i;
      while (j < classBodyClose && src[j] !== ";") j += 1;
      fields.push({ name: fieldMatch[1], text: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    i += 1;
  }

  const header = src.slice(classBodyOpen, classBodyClose);
  if (/(?:public|private|protected)\s+(?!static\b)[\w.<>,\[\]]+\s+[A-Za-z_]\w*\s*[=;]/.test(header)) {
    return null;
  }

  return {
    packageName: pkgMatch ? pkgMatch[1] : "",
    className,
    fields,
    methods,
  };
}

function parseJavaParams(paramsRaw) {
  if (!paramsRaw.trim()) return [];
  return paramsRaw
    .split(",")
    .map((p) => {
      const parts = p.trim().split(/\s+/);
      return parts[parts.length - 1].replace(/[\[\]]/g, "");
    })
    .filter(Boolean);
}

function prefixJavaMembers(body, className, memberNames, paramNames) {
  const skip = new Set(paramNames);
  const members = [...memberNames].filter((n) => !skip.has(n)).sort((a, b) => b.length - a.length);
  let out = "";
  let i = 0;
  while (i < body.length) {
    const next = skipNonCode(body, i);
    if (next > i) {
      out += body.slice(i, next);
      i = next;
      continue;
    }
    const id = body.slice(i).match(/^[A-Za-z_]\w*/);
    if (id && members.includes(id[0]) && !/[\w.]$/.test(out)) {
      out += `${className}.${id[0]}`;
      i += id[0].length;
      continue;
    }
    out += body[i];
    i += 1;
  }
  return out;
}

async function splitJavaFile(_filePath) {
  // Disabled: wrapper merge is too fragile for real Android helpers.
  return null;
}

async function splitJavaFileDisabled(filePath) {
  const src = await fs.readFile(filePath, "utf8");
  if (isDecoySource(src) || isSplitPartSource(src) || isAlreadySplitHost(src)) {
    return null;
  }
  const base = path.basename(filePath);
  if (SKIP_ANDROID_NAME.test(base) || /Part\d+\./.test(base)) return null;
  if (
    filePath.includes(`${path.sep}bolts${path.sep}`) ||
    filePath.includes(`${path.sep}linkkit${path.sep}`) ||
    /[\\/]b[A-Za-z0-9]+olts[\\/]/.test(filePath)
  ) {
    return null;
  }
  if (/AppLinkBridge|ViewportBridge/i.test(base)) return null;

  const parsed = parseJavaStaticClass(src);
  if (!parsed || parsed.methods.length < 4) return null;

  const keepNames = new Set(
    parsed.methods
      .filter(
        (m) =>
          /setApplicationContext/i.test(m.name) ||
          (/getContext/i.test(m.name) && !/(load|save|String|Int|Boolean|Key)/.test(m.name))
      )
      .map((m) => m.name)
  );
  const movable = parsed.methods.filter(
    (m) => !keepNames.has(m.name) && !/\bnew\s+/.test(m.body)
  );
  if (movable.length < 3) return null;
  if (Math.random() < SPLIT_KEEP_WHOLE_CHANCE) return null;

  const memberNames = new Set([
    ...parsed.fields.map((f) => f.name),
    ...parsed.methods.map((m) => m.name),
  ]);
  const chunks = packIntoParts(
    movable.map((m) => [m]),
    pickPartCount(movable.length)
  );

  const dir = path.dirname(filePath);
  const imports = (src.match(/^import\s+.+;$/gm) || []).join("\n");
  const partMeta = [];
  const partFiles = [];

  for (let p = 0; p < chunks.length; p++) {
    const chunk = chunks[p];
    const partClass = `${parsed.className}Part${String(p + 1).padStart(2, "0")}`;
    const partPath = path.join(dir, `${partClass}.java`);
    const methodsSrc = chunk
      .map((m) => {
        const params = parseJavaParams(m.paramsRaw);
        const body = prefixJavaMembers(m.body, parsed.className, memberNames, params);
        const sig = m.signature
          .replace(/\bprivate\s+/, "public ")
          .replace(/\bprotected\s+/, "public ");
        return `    ${sig.trim()}\n    ${body.trim()}`;
      })
      .join("\n\n");
    const partSrc = `${SPLIT_MARKER}
package ${parsed.packageName};

${imports ? `${imports}\n` : ""}
public final class ${partClass} {
    private ${partClass}() {}

${methodsSrc}
}
`;
    const already = await existingTypeFile(dir, partClass);
    if (already && path.normalize(already) !== path.normalize(partPath)) {
      partFiles.push(already);
      partMeta.push({ partClass, methods: chunk });
      continue;
    }
    await fs.writeFile(partPath, partSrc, "utf8");
    partFiles.push(partPath);
    partMeta.push({ partClass, methods: chunk });
  }

  let next = src;
  const wrappers = [];
  for (const { partClass, methods } of partMeta) {
    for (const m of methods) wrappers.push({ ...m, partClass });
  }
  wrappers.sort((a, b) => b.start - a.start);
  for (const m of wrappers) {
    const params = parseJavaParams(m.paramsRaw);
    const argList = params.join(", ");
    const indent = (m.signature.match(/^(\s*)/) || ["", "    "])[1] || "    ";
    const header = m.signature.replace(/\s*\{\s*$/, "").trim();
    const wrapper = m.isVoid
      ? `${indent}${header} {\n${indent}    ${m.partClass}.${m.name}(${argList});\n${indent}}`
      : `${indent}${header} {\n${indent}    return ${m.partClass}.${m.name}(${argList});\n${indent}}`;
    next = next.slice(0, m.start) + wrapper + next.slice(m.end);
  }

  next = next.replace(/\bprivate\s+static\b/g, "static");
  if (!next.includes(SPLIT_BEGIN)) {
    const pkgEnd = next.indexOf("\n", next.indexOf("package "));
    next = `${next.slice(0, pkgEnd + 1)}${SPLIT_BEGIN}\n${SPLIT_END}\n${next.slice(pkgEnd + 1)}`;
  }
  await fs.writeFile(filePath, next, "utf8");
  return { host: filePath, parts: partFiles, helpers: movable.length };
}

function parseKotlinPrivateFuns(src) {
  const funs = [];
  const re = /(^|\n)([ \t]*)private fun\s+([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    const start = m.index + (m[1] ? m[1].length : 0);
    const indent = m[2];
    const name = m[3];
    const parenOpen = m.index + m[0].length - 1;
    const parenClose = matchBrackets(src, parenOpen);
    if (parenClose < 0) continue;
    const bodyOpen = findBodyOpen(src, parenClose);
    if (bodyOpen < 0) continue;
    const bodyClose = matchBrackets(src, bodyOpen);
    if (bodyClose < 0) continue;
    const prevLine = src.slice(Math.max(0, start - 120), start);
    if (/@ReactMethod\b/.test(prevLine.split("\n").pop() || "") || /@ReactMethod\b/.test(prevLine)) {
      continue;
    }
    if (/@androidx\.annotation\.Keep\b/.test(prevLine) || /@Keep\b/.test(prevLine)) {
      continue;
    }
    const body = src.slice(bodyOpen, bodyClose + 1);
    if (/\bthis\b/.test(body) || /\breactApplicationContext\b/.test(body)) continue;
    funs.push({
      name,
      indent,
      start,
      end: bodyClose + 1,
      text: src.slice(start, bodyClose + 1),
      paramsRaw: src.slice(parenOpen + 1, parenClose),
    });
  }
  return funs;
}

async function splitKotlinFile(filePath) {
  const src = await fs.readFile(filePath, "utf8");
  if (isDecoySource(src) || isSplitPartSource(src) || isAlreadySplitHost(src)) {
    return null;
  }
  const base = path.basename(filePath);
  if (SKIP_ANDROID_NAME.test(base) || /Part\d+\./.test(base)) return null;
  if (
    filePath.includes(`${path.sep}bolts${path.sep}`) ||
    filePath.includes(`${path.sep}linkkit${path.sep}`) ||
    /[\\/]b[A-Za-z0-9]+olts[\\/]/.test(filePath)
  ) {
    return null;
  }

  const funs = parseKotlinPrivateFuns(src);
  if (funs.length === 0) return null;
  if (Math.random() < SPLIT_KEEP_WHOLE_CHANCE) return null;

  const pkgMatch = src.match(/^\s*package\s+([\w.]+)\s*$/m);
  const imports = (src.match(/^import\s+.+$/gm) || []).join("\n");
  const classMatch = src.match(/\bclass\s+([A-Za-z_]\w*)/);
  const className = classMatch ? classMatch[1] : path.basename(filePath, ".kt");
  const chunks = packIntoParts(
    funs.map((f) => [f]),
    pickPartCount(funs.length)
  );
  const dir = path.dirname(filePath);
  const partFiles = [];
  const nameToPart = new Map();

  for (let p = 0; p < chunks.length; p++) {
    const chunk = chunks[p];
    const partClass = `${className}Part${String(p + 1).padStart(2, "0")}`;
    const partPath = path.join(dir, `${partClass}.kt`);
    const objectFns = chunk
      .map((f) => {
        const body = f.text.replace(/\bprivate fun\b/, "fun");
        return stripLeadingIndent(body, f.indent.length).trim();
      })
      .join("\n\n    ");
    const partSrc = `${SPLIT_MARKER}
package ${pkgMatch ? pkgMatch[1] : ""}

${imports ? `${imports}\n` : ""}
object ${partClass} {
    ${objectFns}
}
`;
    const already = await existingTypeFile(dir, partClass);
    if (!(already && path.normalize(already) !== path.normalize(partPath))) {
      await fs.writeFile(partPath, partSrc, "utf8");
    }
    partFiles.push(already && path.normalize(already) !== path.normalize(partPath) ? already : partPath);
    for (const f of chunk) nameToPart.set(f.name, partClass);
  }

  let next = src;
  for (const f of [...funs].sort((a, b) => b.start - a.start)) {
    next = next.slice(0, f.start) + next.slice(f.end);
  }
  for (const f of funs) {
    const partClass = nameToPart.get(f.name);
    next = next.replace(
      new RegExp(`\\b${escapeRegExp(f.name)}\\s*\\(`, "g"),
      `${partClass}.${f.name}(`
    );
  }
  next = next.replace(/\n{3,}/g, "\n\n");
  if (!next.includes(SPLIT_BEGIN)) {
    const pkgLine = next.match(/^\s*package\s+[\w.]+\s*$/m);
    if (pkgLine) {
      const insertAt = pkgLine.index + pkgLine[0].length;
      next = `${next.slice(0, insertAt)}\n${SPLIT_BEGIN}\n${SPLIT_END}${next.slice(insertAt)}`;
    }
  }
  await fs.writeFile(filePath, next, "utf8");
  return { host: filePath, parts: partFiles, helpers: funs.length };
}

function stripSplitMarkers(src) {
  return src.replace(
    new RegExp(
      `\\n?${escapeRegExp(SPLIT_BEGIN)}[\\s\\S]*?${escapeRegExp(SPLIT_END)}\\n?`,
      "g"
    ),
    "\n"
  );
}

function partPathsForHost(hostPath) {
  const dir = path.dirname(hostPath);
  const ext = path.extname(hostPath);
  const base = path.basename(hostPath, ext);
  const paths = [];
  for (let i = 1; i <= 9; i++) {
    paths.push(path.join(dir, `${base}Part${String(i).padStart(2, "0")}${ext}`));
  }
  return paths;
}

async function existingTypeFile(dir, typeName) {
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return null;
  }
  const re = new RegExp(
    `\\b(?:object|class|interface)\\s+${escapeRegExp(typeName)}\\b`
  );
  for (const entry of entries) {
    if (!/\.(kt|java)$/.test(entry)) continue;
    const full = path.join(dir, entry);
    let text;
    try {
      text = await fs.readFile(full, "utf8");
    } catch {
      continue;
    }
    if (re.test(text)) return full;
  }
  return null;
}

function hostPathFromPart(partPath) {
  const ext = path.extname(partPath);
  const base = path.basename(partPath, ext).replace(/Part\d+$/, "");
  return path.join(path.dirname(partPath), `${base}${ext}`);
}

async function mergeTsHost(hostPath, partFiles) {
  let src = await fs.readFile(hostPath, "utf8");
  const bodies = [];
  for (const partPath of partFiles) {
    let text = await fs.readFile(partPath, "utf8");
    text = text.replace(SPLIT_MARKER, "").replace(/^export function /gm, "function ").trim();
    if (text) bodies.push(text);
    await fs.unlink(partPath);
  }
  src = stripSplitMarkers(src).replace(/\n{3,}/g, "\n\n").trimEnd();
  if (bodies.length) src = `${src}\n\n${bodies.join("\n\n")}\n`;
  else src = `${src}\n`;
  await fs.writeFile(hostPath, src, "utf8");
}

function extractJavaPartMethods(src, hostClass) {
  const classMatch = src.match(/\bclass\s+[A-Za-z_]\w*[^{]*\{/);
  if (!classMatch) return [];
  const open = classMatch.index + classMatch[0].length - 1;
  const close = matchBrackets(src, open);
  if (close < 0) return [];
  const methods = [];
  let i = open + 1;
  while (i < close) {
    i = skipNonCode(src, i);
    if (i >= close) break;
    const slice = src.slice(i, close);
    const m = slice.match(
      /^(?:public|private|protected)\s+static\s+(?:final\s+)?([\w.<>,\[\]]+)\s+([A-Za-z_]\w*)\s*\(/
    );
    if (!m || m.index !== 0) {
      i += 1;
      continue;
    }
    const parenOpen = i + m[0].length - 1;
    const parenClose = matchBrackets(src, parenOpen);
    if (parenClose < 0) {
      i += 1;
      continue;
    }
    let bodyOpen = skipNonCode(src, parenClose + 1);
    if (src[bodyOpen] !== "{") {
      i += 1;
      continue;
    }
    let innerOpen = bodyOpen;
    const after = skipNonCode(src, bodyOpen + 1);
    if (src[after] === "{") innerOpen = after;
    const innerClose = matchBrackets(src, innerOpen);
    const outerClose = matchBrackets(src, bodyOpen);
    if (innerClose < 0 || outerClose < 0) {
      i += 1;
      continue;
    }
    let bodyInner = src.slice(innerOpen + 1, innerClose);
    bodyInner = bodyInner.replace(new RegExp(`\\b${escapeRegExp(hostClass)}\\.`, "g"), "");
    methods.push({ name: m[2], bodyInner });
    i = outerClose + 1;
  }
  return methods;
}

function replaceJavaDelegates(src, hostClass, methodBodies) {
  const classMatch = src.match(/\bclass\s+[A-Za-z_]\w*[^{]*\{/);
  if (!classMatch) return src;
  const open = classMatch.index + classMatch[0].length - 1;
  const close = matchBrackets(src, open);
  if (close < 0) return src;
  const replacements = [];
  let i = open + 1;
  while (i < close) {
    i = skipNonCode(src, i);
    if (i >= close) break;
    const slice = src.slice(i, close);
    const m = slice.match(
      /^(?:public|private|protected)?\s*static\s+(?:final\s+)?([\w.<>,\[\]]+)\s+([A-Za-z_]\w*)\s*\(/
    );
    if (!m || m.index !== 0) {
      i += 1;
      continue;
    }
    const parenOpen = i + m[0].length - 1;
    const parenClose = matchBrackets(src, parenOpen);
    if (parenClose < 0) {
      i += 1;
      continue;
    }
    const bodyOpen = skipNonCode(src, parenClose + 1);
    if (src[bodyOpen] !== "{") {
      i += 1;
      continue;
    }
    const bodyClose = matchBrackets(src, bodyOpen);
    if (bodyClose < 0) {
      i += 1;
      continue;
    }
    const body = src.slice(bodyOpen + 1, bodyClose).trim();
    const del = body.match(
      new RegExp(
        `^(?:return\\s+)?${escapeRegExp(hostClass)}Part\\d+\\.${escapeRegExp(m[2])}\\s*\\([^;]*\\)\\s*;$`
      )
    );
    if (del && methodBodies.has(m[2])) {
      replacements.push({
        start: bodyOpen,
        end: bodyClose + 1,
        text: `{\n${methodBodies.get(m[2]).replace(/\s+$/, "")}\n    }`,
      });
    }
    i = bodyClose + 1;
  }
  let next = src;
  for (const r of replacements.sort((a, b) => b.start - a.start)) {
    next = next.slice(0, r.start) + r.text + next.slice(r.end);
  }
  next = next.replace(/^([ \t]+)static final /gm, "$1private static final ");
  next = next.replace(
    /^([ \t]+)static Context getContext\(/gm,
    "$1private static Context getContext("
  );
  next = next.replace(
    /^([ \t]+)static ([A-Z][\w.<>,\[\]]*) (\w+)(\s*[=;])/gm,
    "$1private static $2 $3$4"
  );
  return next;
}

async function mergeJavaHost(hostPath, partFiles) {
  let src = await fs.readFile(hostPath, "utf8");
  const classMatch = src.match(/\bclass\s+([A-Za-z_]\w*)/);
  const hostClass = classMatch ? classMatch[1] : path.basename(hostPath, ".java");
  const methodBodies = new Map();
  for (const partPath of partFiles) {
    const text = await fs.readFile(partPath, "utf8");
    for (const m of extractJavaPartMethods(text, hostClass)) {
      methodBodies.set(m.name, m.bodyInner);
    }
    await fs.unlink(partPath);
  }
  src = replaceJavaDelegates(src, hostClass, methodBodies);
  src = stripSplitMarkers(src).replace(/\n{3,}/g, "\n\n");
  await fs.writeFile(hostPath, src, "utf8");
}

function extractKotlinObjectFuns(src) {
  const obj = src.match(/\bobject\s+[A-Za-z_]\w*\s*\{/);
  if (!obj) return [];
  const open = obj.index + obj[0].length - 1;
  const close = matchBrackets(src, open);
  if (close < 0) return [];
  const inner = src.slice(open + 1, close).trim();
  return inner ? [inner.replace(/^private fun /gm, "private fun ")] : [];
}

async function mergeKotlinHost(hostPath, partFiles) {
  let src = await fs.readFile(hostPath, "utf8");
  const classMatch = src.match(/\bclass\s+([A-Za-z_]\w*)/);
  const hostClass = classMatch ? classMatch[1] : path.basename(hostPath, ".kt");
  const funs = [];
  for (const partPath of partFiles) {
    const text = await fs.readFile(partPath, "utf8");
    funs.push(...extractKotlinObjectFuns(text));
    await fs.unlink(partPath);
  }
  src = src.replace(
    new RegExp(`\\b${escapeRegExp(hostClass)}Part\\d+\\.`, "g"),
    ""
  );
  src = stripSplitMarkers(src);
  if (funs.length) {
    const lastBrace = src.lastIndexOf("}");
    if (lastBrace >= 0) {
      const block = funs
        .map((f) =>
          f
            .split("\n")
            .map((line) => (line.trim() ? `    ${line.trimStart()}` : ""))
            .join("\n")
        )
        .join("\n\n");
      src = `${src.slice(0, lastBrace).trimEnd()}\n\n${block}\n}\n`;
    }
  }
  src = src.replace(/\n{3,}/g, "\n\n");
  await fs.writeFile(hostPath, src, "utf8");
}

async function mergeExistingSplits(rootPath) {
  const servicesDir = path.join(rootPath, "services");
  const gameDir = path.join(rootPath, "Layouts", "Game");
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const hosts = new Map();
  const scanDirs = [];
  if (await safeStat(servicesDir)) scanDirs.push([servicesDir, new Set([".ts", ".tsx"])]);
  if (await safeStat(gameDir)) scanDirs.push([gameDir, new Set([".ts", ".tsx"])]);
  if (await safeStat(javaRoot)) scanDirs.push([javaRoot, new Set([".java", ".kt"])]);

  for (const [dir, exts] of scanDirs) {
    const files = await walkFiles(dir, { exts });
    for (const file of files) {
      const name = path.basename(file, path.extname(file));
      if (!/Part\d+$/.test(name)) continue;
      const host = hostPathFromPart(file);
      if (!hosts.has(host)) hosts.set(host, []);
      hosts.get(host).push(file);
    }
  }

  let merged = 0;
  for (const [host, parts] of hosts) {
    if (!(await safeStat(host))) continue;
    parts.sort();
    const ext = path.extname(host).toLowerCase();
    try {
      if (ext === ".ts" || ext === ".tsx") await mergeTsHost(host, parts);
      else if (ext === ".java") await mergeJavaHost(host, parts);
      else if (ext === ".kt") await mergeKotlinHost(host, parts);
      merged += 1;
    } catch (err) {
      throw new Error(`merge ${path.basename(host)}: ${err.message}`);
    }
  }
  return merged;
}

async function splitExistingUnits(rootPath) {
  const merged = await mergeExistingSplits(rootPath);
  const servicesDir = path.join(rootPath, "services");
  const gameDir = path.join(rootPath, "Layouts", "Game");
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const hosts = [];
  const parts = [];
  const errors = [];
  let serviceHosts = 0;
  let serviceParts = 0;
  let gameHosts = 0;
  let gameParts = 0;

  if (await safeStat(servicesDir)) {
    const tsFiles = await walkFiles(servicesDir, { exts: new Set([".ts", ".tsx"]) });
    for (const file of tsFiles) {
      try {
        const result = await splitTsFile(file);
        if (result) {
          hosts.push(result.host);
          parts.push(...result.parts);
          serviceHosts += 1;
          serviceParts += result.parts.length;
        }
      } catch (err) {
        errors.push(`${path.basename(file)}: ${err.message}`);
      }
    }
  }

  if (await safeStat(gameDir)) {
    const gameOpts = {
      minParts: MIN_PARTS_GAME,
      maxParts: MAX_PARTS_GAME,
      keepWholeChance: SPLIT_KEEP_WHOLE_CHANCE_GAME,
    };
    const tsFiles = await walkFiles(gameDir, { exts: new Set([".ts", ".tsx"]) });
    for (const file of tsFiles) {
      if (shouldSkipGameTs(file)) continue;
      try {
        const result = await splitTsFile(file, gameOpts);
        if (result) {
          hosts.push(result.host);
          parts.push(...result.parts);
          gameHosts += 1;
          gameParts += result.parts.length;
        }
      } catch (err) {
        errors.push(`${path.basename(file)}: ${err.message}`);
      }
    }
  }

  if (await safeStat(javaRoot)) {
    const javaFiles = await walkFiles(javaRoot, { exts: new Set([".java"]) });
    for (const file of javaFiles) {
      try {
        const result = await splitJavaFile(file);
        if (result) {
          hosts.push(result.host);
          parts.push(...result.parts);
        }
      } catch (err) {
        errors.push(`${path.basename(file)}: ${err.message}`);
      }
    }
    const ktFiles = await walkFiles(javaRoot, { exts: new Set([".kt"]) });
    for (const file of ktFiles) {
      try {
        const result = await splitKotlinFile(file);
        if (result) {
          hosts.push(result.host);
          parts.push(...result.parts);
        }
      } catch (err) {
        errors.push(`${path.basename(file)}: ${err.message}`);
      }
    }
  }

  let details =
    `merged ${merged}, then split ${hosts.length} host(s) → +${parts.length} part file(s)` +
    ` (services ${serviceHosts}/${serviceParts}, game ${gameHosts}/${gameParts})`;
  if (errors.length) details += `; warnings: ${errors.slice(0, 3).join("; ")}`;
  return {
    ok: errors.length === 0,
    details,
    hosts: hosts.length,
    parts: parts.length,
    errors,
  };
}

module.exports = {
  splitExistingUnits,
  mergeExistingSplits,
  SPLIT_MARKER,
};
