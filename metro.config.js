const { getDefaultConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// rn-obfuscator-begin
const { withRnObfuscator } = require("./scripts/rn-obfuscator/metro");
// rn-obfuscator-end

module.exports = withRnObfuscator({
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    // Watchman cannot open this root: the folder name has non-ASCII characters.
    useWatchman: false,
  },
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
});