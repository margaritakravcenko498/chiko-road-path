const fs = require("node:fs");
const path =
  "C:/Users/EvoReD/AppData/Local/Programs/cursor/resources/app/out/vs/workbench/workbench.desktop.main.js";
const s = fs.readFileSync(path, "utf8");
const start = s.indexOf("async createComposerImpl(e)");
const chunk = s.slice(start, start + 4500);
const at = chunk.indexOf("const s=e.partialState,o=");
console.log(chunk.slice(at, at + 1600));
