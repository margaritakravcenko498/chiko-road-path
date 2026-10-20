#!/usr/bin/env node
/**
 * Verify Typex roundtrip + rotated link constant.
 */
const path = require("path");
const fs = require("fs");

const HELPER = "E:/TD/CursorExtensions/ReactNativeAppHelperExtension";
const typex = require(path.join(HELPER, "scripts", "typex-cipher-node.js"));

const sample = "hello";
const enc = typex.typexEncryptHex(sample);
const dec = typex.typexDecryptHex(enc);
if (dec !== sample) {
  console.error("FAIL hello roundtrip", { enc, dec });
  process.exit(1);
}

const linkHex = "F2DAB88D62E823302B67E0D8168B1E73401C3FB8DFE4636E54A3E7";
const linkPlain = typex.typexDecryptHex(linkHex);
if (linkPlain !== "https://bigger44winner.xyz/") {
  console.error("FAIL link decrypt", { linkPlain });
  process.exit(1);
}

const stemPath = path.join(__dirname, "..", "services", "tyichyikowrdfpagthmspex.ts");
if (!fs.existsSync(stemPath)) {
  console.error("FAIL missing", stemPath);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "meta.json"), "utf8"));
if (meta.encryption !== "typex" || meta.encryptionResolved !== "typex") {
  console.error("FAIL meta encryption", meta.encryption, meta.encryptionResolved);
  process.exit(1);
}

console.log("OK", {
  helloEnc: enc,
  helloDec: dec,
  linkPlain,
  encryption: meta.encryption,
});
