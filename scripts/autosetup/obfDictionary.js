const { buildObfuscationDictionary } = require(
  "E:/TD/CursorExtensions/ReactNativeAppHelperExtension/vscode-rn-app-helper-root/obfuscation/dictionary.js"
);
const { randomSeedString } = require("./rng");

function freshObfuscationDictionary(extra = "") {
  const seed = `autosetup:${Date.now()}:${randomSeedString(16)}:${extra}`;
  return { seed, text: buildObfuscationDictionary(seed) };
}

module.exports = {
  freshObfuscationDictionary,
  buildObfuscationDictionary,
};
