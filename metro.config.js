const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add .ahap extension for Core Haptics patterns
config.resolver.assetExts.push("ahap");

module.exports = withNativeWind(config, { input: "./src/global.css" });
