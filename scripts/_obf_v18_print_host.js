const fs = require("fs");
const src = fs
  .readFileSync("scripts/_obf_v18.js", "utf8")
  .replace(/\nmain\(\);\s*$/, "\nmodule.exports = { helperSlug, fnv1a, buildBatch, kotlinHelper, sinkExpr, FRAG, BATCH };\n");
fs.writeFileSync("scripts/_obf_v18_lib.js", src);
const { helperSlug, fnv1a, buildBatch, kotlinHelper, sinkExpr, FRAG, BATCH } = require("./_obf_v18_lib");
const file = "android/app/src/main/java/com/xvloolwclanodraqivn3978/Garetahubeluf.kt";
const slug = helperSlug(file);
const seed = fnv1a(`${FRAG}|${slug}|${BATCH}`);
const batch = buildBatch(slug, seed, "ts");
console.log("SLUG", slug);
console.log("SINK", sinkExpr(batch.specs, "kt"));
console.log(batch.specs.map((s) => kotlinHelper(s)).join("\n\n"));
