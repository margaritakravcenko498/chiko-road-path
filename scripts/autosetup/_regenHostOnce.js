const fs = require("fs");
const path = require("path");
const { applyHostFragment } = require("./applyHostFragment");
const { detectFragmentFromConstants } = require("./applyMeta");

(async () => {
  const root = path.resolve(__dirname, "..", "..");
  const metaPath = path.join(root, "meta.json");
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  delete meta.hostFragmentBoundTo;
  meta.hostFragment = "";
  const projectFragment = await detectFragmentFromConstants(root);
  const result = await applyHostFragment(root, meta, projectFragment);
  console.log(result);
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  const gradle = fs.readFileSync(path.join(root, "android", "app", "build.gradle"), "utf8");
  const ns = (gradle.match(/namespace\s+"([^"]+)"/) || [])[1];
  console.log("namespace:", ns);
  console.log("Class Name:", `${ns}.MainActivity`);
  console.log("hostFragment:", meta.hostFragment);
  console.log("hostFragmentBoundTo:", meta.hostFragmentBoundTo);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
