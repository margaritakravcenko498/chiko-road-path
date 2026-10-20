const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { loadGitCredentials, restoreGitHubDesktopCredentialHelper } = require("./jiraExtras");

function redact(text) {
  return String(text || "")
    .replace(/ghp_[A-Za-z0-9]+/g, "ghp_***")
    .replace(/github_pat_[A-Za-z0-9_]+/g, "github_pat_***");
}

async function main() {
  const meta = JSON.parse(fs.readFileSync(path.join(process.cwd(), "meta.json"), "utf8"));
  const creds = await loadGitCredentials(meta);
  const token = String(creds.token || "").trim();
  console.log(
    `issue=${creds.issueKey} len=${token.length} prefix=${token.slice(0, 4)} spaces=${/\s/.test(token)}`
  );
  if (!token.startsWith("ghp_") && !token.startsWith("github_pat_")) {
    console.log("token prefix is not a GitHub token");
    process.exit(2);
  }

  const meRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "autosetup",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const me = await meRes.json();
  console.log(`token_login=${me.login || ""} status=${meRes.status}`);
  if (!me.login) process.exit(3);

  const env = { ...process.env };
  delete env.GH_TOKEN;
  delete env.GITHUB_TOKEN;
  delete env.GH_ENTERPRISE_TOKEN;
  const child = spawn(
    "C:\\Program Files\\GitHub CLI\\gh.exe",
    ["auth", "login", "--hostname", "github.com", "--git-protocol", "https", "--with-token", "--insecure-storage"],
    {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
      env,
    }
  );
  let out = "";
  child.stdout.on("data", (chunk) => {
    out += chunk;
  });
  child.stderr.on("data", (chunk) => {
    out += chunk;
  });
  child.stdin.write(`${token}\n`);
  child.stdin.end();
  const code = await new Promise((resolve) => child.on("close", resolve));
  console.log(`gh_auth_exit=${code} out_len=${out.length}`);
  console.log(JSON.stringify(redact(out)));
  if (code === 0) {
    restoreGitHubDesktopCredentialHelper();
    console.log("git_credential_helper=manager");
  }
  process.exit(code || 0);
}

main().catch((error) => {
  console.log(redact(error instanceof Error ? error.message : String(error)));
  process.exit(1);
});
