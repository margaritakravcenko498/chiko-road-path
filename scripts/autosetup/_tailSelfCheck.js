const { transformNative } = require("./applyServiceHelpers");
const { componentSource } = require("./applyInteractiveLoader");
const { workflowYaml } = require("./setupGithubAab");
const { buildParagraph } = require("./postGameDescription");

const src = "class Foo {\n  fun bar(a: Int): Int {\n    return a\n  }\n}\n";
const native = transformNative(src, { filePath: "CCipher.kt", fragment: "frag" });
if (!native.next.includes("private fun") || !native.next.includes("fragCCipherObfV1Mix")) {
  console.log(native.next);
  process.exit(1);
}

const component = componentSource({
  exportName: "IdlefragLoaderLayer",
  colors: ["#FFFFFF", "#000000", "#AABBCC"],
  showBar: true,
  appName: "Prism",
});
if (!component.includes("function IdlefragLoaderLayer") || !component.includes("bit.size")) {
  console.log(component);
  process.exit(1);
}

const yaml = workflowYaml({
  compileSdk: "36",
  buildTools: "36.0.0",
  ndk: "29.0.14206865",
  npmCi: true,
  googleServices: true,
});
if (!yaml.includes("workflow_dispatch") || !yaml.includes("GOOGLE_SERVICES_JSON_BASE64")) {
  console.log("yaml missing pieces");
  process.exit(1);
}
if (!yaml.includes("secrets.KEYSTORE_BASE64")) {
  console.log("yaml missing keystore expr");
  process.exit(1);
}

const paragraph = buildParagraph({ appName: "Prism", phrases: ["Play"], blob: "score" });
if (paragraph.includes("\n-") || paragraph.includes("1.")) {
  console.log(paragraph);
  process.exit(1);
}

console.log("tail self-check ok");
console.log(paragraph);
