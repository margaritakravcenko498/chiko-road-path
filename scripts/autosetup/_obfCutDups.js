const fs = require("node:fs");

const dekPath = "android/app/src/main/java/com/ychikwordcdwpavbth389t8/Dekuxaferazuwi.kt";
let lines = fs.readFileSync(dekPath, "utf8").split(/\r?\n/);
const kept = lines.filter((_, i) => {
  const n = i + 1;
  return n < 81 || n > 201;
});
let text = kept.join("\n");
text = text.replace(/\nprivate fun ichyikowrdfpagthmsCpmvqkrmwismgemgalObfV1HashMix[\s\S]*$/, "\n");
if (!text.endsWith("\n")) text += "\n";
fs.writeFileSync(dekPath, text);
console.log("dek ok", text.includes("ssion_id"), text.includes("class Dekuxaferazuwi"));

const cipherPath = "android/app/src/main/java/com/ychikwordcdwpavbth389t8/Damucavoqukos.kt";
let cl = fs.readFileSync(cipherPath, "utf8").split(/\r?\n/);
const start = cl.findIndex((l) => l.includes("2AenCGGHjQqymeGxZFRZ28wJFbhK"));
const end = cl.findIndex((l, idx) => idx > start && l === "}");
console.log("cipher cut", start + 1, end + 1);
if (start < 0 || end < 0) process.exit(1);
cl.splice(start, end - start);
let ct = cl.join("\n");
ct = ct.replace(/\bfowufadekax\b/g, "transform");
ct = ct.replace(/\bwexojanecu\b/g, "hexToBytes");
ct = ct.replace(/\bnetegoxur\b/g, "bytesToHex");
fs.writeFileSync(cipherPath, ct);
console.log("cipher ok", ct.includes("fun transform"), ct.includes("fun hexToBytes"), ct.includes("2AenCGGHjQqymeGxZFRZ28wJFbhK"));
