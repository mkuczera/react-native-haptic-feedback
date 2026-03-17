/**
 * Expo Config Plugin for react-native-haptic-feedback.
 *
 * Haptic feedback requires no permissions, no Info.plist entries, and no
 * AndroidManifest changes. This plugin exists for Expo CNG compatibility
 * and to prevent "missing plugin" warnings in managed-workflow projects.
 *
 * Usage in app.config.js / app.json:
 *   plugins: ["react-native-haptic-feedback"]
 */

const pkg = require("./package.json");

function withHapticFeedback(config) {
  // No native modifications required.
  return config;
}

try {
  const { createRunOncePlugin } = require("@expo/config-plugins");
  module.exports = createRunOncePlugin(
    withHapticFeedback,
    pkg.name,
    pkg.version,
  );
} catch {
  // @expo/config-plugins not installed (non-Expo project).
  module.exports = withHapticFeedback;
}
