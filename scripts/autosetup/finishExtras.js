const fs = require("node:fs/promises");
const path = require("node:path");

const TAIL_STEPS = ["loader", "helpers", "description", "git-remote", "github-aab", "fb-jira", "repair"];

const SKILL_WINDOWS = [
  { file: "01-interactive-loader.json", title: "interactive-loader", skill: "interactive-loader" },
  { file: "02-services-obfuscation.json", title: "services-obfuscation", skill: "services-obfuscation" },
  {
    file: "03-description-placeholder.json",
    title: "description-placeholder",
    skill: "description-placeholder",
  },
  { file: "04-github-android-aab.json", title: "github-android-aab", skill: "github-android-aab" },
  { file: "05-facebook-class-name.json", title: "facebook-class-name", skill: "facebook-class-name" },
  { file: "06-repair-imports.json", title: "repair-imports", skill: "repair-imports" },
];

/**
 * End of a full autosetup, in the order the skills are usually run by hand:
 * interactive loader, services obfuscation helpers, Jira description comment,
 * GitHub clone (.git only), GitHub AAB workflow + secrets, FB hash / class name,
 * then a pass that fixes broken imports and syntax errors.
 */
async function runFinishExtras(rootPath, meta, { only } = {}) {
  const want = (name) => !only || only.has(name);
  const selected = SKILL_WINDOWS.filter((job) => {
    if (job.file.startsWith("01")) return want("loader");
    if (job.file.startsWith("02")) return want("helpers");
    if (job.file.startsWith("03")) return want("description");
    if (job.file.startsWith("04")) return want("git-remote") || want("github-aab");
    if (job.file.startsWith("05")) return want("fb-jira");
    if (job.file.startsWith("06")) return want("repair");
    return false;
  });
  const dir = path.join(rootPath, ".cursor", "autosetup-windows");
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
  for (const job of selected) {
    await fs.writeFile(
      path.join(dir, job.file),
      `${JSON.stringify({ title: job.title, skill: job.skill, issue: meta?.jiraIssue || "" }, null, 2)}\n`,
      "utf8"
    );
  }
  await fs.writeFile(path.join(dir, "ready"), `${selected.length}\n`, "utf8");
  const titles = selected.map((job) => job.title).join(", ");
  console.log(
    `[autosetup] скиллы (${selected.length}) откроются отдельными чатами агента в этом окне: ${titles}`
  );
  return { warnings: [], skillWindows: selected.length };
}

module.exports = { runFinishExtras, TAIL_STEPS };
