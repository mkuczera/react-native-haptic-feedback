const path = require("path");
const { getConfig } = require("react-native-builder-bob/babel-config");
const pkg = require("../package.json");
console.log(
  "### babel.config.js",
  __dirname,
  typeof __dirname,
  path.resolve(__dirname, ".."),
);
const root = path.resolve(__dirname, "..");

module.exports = getConfig(
  {
    presets: ["module:@react-native/babel-preset"],
  },
  { root, pkg },
);
