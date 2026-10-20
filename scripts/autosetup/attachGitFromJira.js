const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadGitCredentials,
  parseGithubOwnerRepo,
  redactSecrets,
  restoreGitHubDesktopCredentialHelper,
} = require("./jiraExtras");

function runGit(args, cwd) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  const output = redactSecrets(`${result.stdout || ""}\n${result.stderr || ""}`).trim();
  if (result.error) {
    throw new Error(`git ${args[0]}: ${redactSecrets(result.error.message)}`);
  }
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} (${result.status}): ${output || "нет вывода"}`);
  }
  return output;
}

async function readOrigin(rootPath) {
  try {
    return runGit(["remote", "get-url", "origin"], rootPath).trim();
  } catch {
    return "";
  }
}

function sameRepo(a, b) {
  const left = parseGithubOwnerRepo(a);
  const right = parseGithubOwnerRepo(b);
  if (!left || !right) return false;
  return (
    left.owner.toLowerCase() === right.owner.toLowerCase() &&
    left.repo.toLowerCase() === right.repo.toLowerCase()
  );
}

async function stripTokenFromConfig(rootPath) {
  const configPath = path.join(rootPath, ".git", "config");
  const raw = await fs.readFile(configPath, "utf8");
  const next = raw.replace(/https:\/\/[^@\s]+@github\.com\//g, "https://github.com/");
  if (next !== raw) await fs.writeFile(configPath, next, "utf8");
}

function sanitizeRepoName(raw) {
  const cleaned = String(raw || "")
    .trim()
    .replace(/\.git$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 100);
  return cleaned || "app";
}

async function preferredRepoName(rootPath) {
  try {
    const pkg = JSON.parse(await fs.readFile(path.join(rootPath, "package.json"), "utf8"));
    const name = String(pkg?.name || "").trim();
    if (name && /^[A-Za-z0-9._-]+$/.test(name)) return sanitizeRepoName(name);
  } catch {
    // package.json может отсутствовать
  }
  return sanitizeRepoName(path.basename(rootPath));
}

async function githubApi(token, method, apiPath, body) {
  const res = await fetch(`https://api.github.com${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "autosetup",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { ok: res.ok, status: res.status, json };
}

/**
 * Same as the helper Git tab «Ищем / создаём репозиторий по токену»:
 * package.json name, otherwise the only repo the token can see, otherwise create a private repo.
 */
async function resolveRepoFromToken(token, rootPath) {
  const preferredName = await preferredRepoName(rootPath);
  const me = await githubApi(token, "GET", "/user");
  if (!me.ok || !me.json?.login) {
    throw new Error(
      `GitHub /user ${me.status || ""}: ${me.json?.message || "токен не принят"}`.trim()
    );
  }
  const login = String(me.json.login);
  const direct = await githubApi(
    token,
    "GET",
    `/repos/${encodeURIComponent(login)}/${encodeURIComponent(preferredName)}`
  );
  if (direct.ok && direct.json?.name) {
    return {
      owner: direct.json.owner?.login || login,
      repo: direct.json.name,
      created: false,
    };
  }

  const listed = [];
  for (let page = 1; page <= 5; page++) {
    const pageRes = await githubApi(
      token,
      "GET",
      `/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator&sort=updated`
    );
    if (!pageRes.ok || !Array.isArray(pageRes.json)) break;
    listed.push(...pageRes.json);
    if (pageRes.json.length < 100) break;
  }
  const preferredLower = preferredName.toLowerCase();
  const match =
    listed.find((repo) => String(repo?.name || "").toLowerCase() === preferredLower) ||
    (listed.length === 1 ? listed[0] : null);
  if (match?.name) {
    return {
      owner: match.owner?.login || login,
      repo: match.name,
      created: false,
    };
  }

  const created = await githubApi(token, "POST", "/user/repos", {
    name: preferredName,
    private: true,
    auto_init: false,
    description: path.basename(rootPath),
  });
  if (!created.ok || !created.json?.name) {
    throw new Error(
      `Не удалось создать ${login}/${preferredName}: ${
        created.json?.message || `HTTP ${created.status}`
      }`
    );
  }
  return {
    owner: created.json.owner?.login || login,
    repo: created.json.name,
    created: true,
  };
}

async function attachGitFromJira(rootPath, meta) {
  restoreGitHubDesktopCredentialHelper();
  const creds = await loadGitCredentials(meta);
  if (!creds.token) {
    throw new Error(
      `В ${creds.issueKey} нет строки [github] : <token> в Description или Details`
    );
  }
  if (creds.platform !== "github") {
    throw new Error(`Ожидается GitHub token, в задаче платформа ${creds.platform}`);
  }
  let parsed = parseGithubOwnerRepo(creds.gitUrl);
  let viaToken = null;
  if (!parsed) {
    viaToken = await resolveRepoFromToken(creds.token, rootPath);
    parsed = { owner: viaToken.owner, repo: viaToken.repo };
  }
  const cleanUrl = `https://github.com/${parsed.owner}/${parsed.repo}.git`;
  const resolvedNote = viaToken
    ? viaToken.created
      ? `репо создан по токену ${parsed.owner}/${parsed.repo}`
      : `репо по токену ${parsed.owner}/${parsed.repo}`
    : "";
  const gitDir = path.join(rootPath, ".git");
  let hasGit = false;
  try {
    await fs.access(gitDir);
    hasGit = true;
  } catch {
    hasGit = false;
  }

  if (hasGit) {
    const origin = await readOrigin(rootPath);
    if (sameRepo(origin, cleanUrl)) {
      return {
        ok: true,
        skippedClone: true,
        details: [resolvedNote, `.git уже указывает на ${parsed.owner}/${parsed.repo}`]
          .filter(Boolean)
          .join("; "),
        owner: parsed.owner,
        repo: parsed.repo,
        token: creds.token,
        cleanUrl,
      };
    }
    return {
      ok: true,
      skippedClone: true,
      skippedRemote: true,
      details:
        `.git уже есть (origin не совпадает с ${parsed.owner}/${parsed.repo}) — clone не делался`,
      owner: parsed.owner,
      repo: parsed.repo,
      token: creds.token,
      cleanUrl,
    };
  }

  const tempDir = path.join(
    os.tmpdir(),
    `autosetup-git-${parsed.repo.replace(/[^\w.-]+/g, "_")}-${Date.now()}`
  );
  const cloneUrl = `https://x-access-token:${encodeURIComponent(creds.token)}@github.com/${parsed.owner}/${parsed.repo}.git`;
  try {
    runGit(["clone", "--quiet", cloneUrl, tempDir], os.tmpdir());
    await fs.cp(path.join(tempDir, ".git"), gitDir, { recursive: true });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
  runGit(["remote", "set-url", "origin", cleanUrl], rootPath);
  await stripTokenFromConfig(rootPath);
  return {
    ok: true,
    skippedClone: false,
    details: [resolvedNote, `.git скопирован из ${parsed.owner}/${parsed.repo}`]
      .filter(Boolean)
      .join("; "),
    owner: parsed.owner,
    repo: parsed.repo,
    token: creds.token,
    cleanUrl,
  };
}

module.exports = { attachGitFromJira };
