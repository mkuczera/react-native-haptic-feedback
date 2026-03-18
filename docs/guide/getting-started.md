# Getting Started

## Requirements

| Platform     | Minimum                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| iOS          | 13.0                                                                                          |
| Android      | API 23 (Android 6.0)                                                                          |
| React Native | 0.71.0                                                                                        |
| Web          | Browsers with [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) |

## Installation

::: code-group

```sh [npm]
npm install react-native-haptic-feedback
```

```sh [yarn]
yarn add react-native-haptic-feedback
```

:::

### iOS — CocoaPods

```sh
cd ios && pod install
```

No manual linking needed — the library uses React Native's auto-linking.

### Android

No extra steps. Auto-linking handles everything.

### Expo managed workflow

Add the plugin to your `app.config.js`:

```js
export default {
  plugins: ["react-native-haptic-feedback"],
};
```

No permissions or entitlements are needed — haptic feedback is a device-output function.

---

## Basic usage

### Trigger a single haptic

```ts
import HapticFeedback from "react-native-haptic-feedback";

HapticFeedback.trigger("impactMedium");
```

### Use the enum for type safety

```ts
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";

HapticFeedback.trigger(HapticFeedbackTypes.notificationSuccess);
```

### Pass options

```ts
HapticFeedback.trigger("impactHeavy", {
  enableVibrateFallback: true, // vibrate on unsupported iOS devices
  ignoreAndroidSystemSettings: false, // respect Android silent/vibrate mode
});
```

---

## Named exports

Everything you need can be imported individually:

```ts
import {
  // Core methods
  trigger,
  impact,
  stop,
  isSupported,
  triggerPattern,
  getSystemHapticStatus,
  setEnabled,
  isEnabled,

  // iOS-only
  playAHAP,

  // Cross-platform
  playHaptic,

  // Pattern helpers
  pattern,
  Patterns,
  PATTERN_CHARS,

  // React integration
  useHaptics,
  TouchableHaptic,

  // Enum & types
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
```

---

## Checking device support

```ts
import {
  isSupported,
  getSystemHapticStatus,
  isRingerSilent,
} from "react-native-haptic-feedback";

if (isSupported()) {
  const status = await getSystemHapticStatus();

  console.log(status.vibrationEnabled); // true/false
  console.log(status.ringerMode); // 'normal' | 'vibrate' | 'silent' | null

  if (isRingerSilent(status)) {
    // Android: device is in silent mode
  }
}
```

> On iOS, `ringerMode` is always `null` — the OS does not expose it publicly.

---

## Next steps

- [Pattern notation](/guide/pattern) — compose multi-event sequences
- [iOS guide](/guide/ios) — Core Haptics & AHAP files
- [Android guide](/guide/android) — API levels & haptic constants
- [useHaptics hook](/api/use-haptics) — React integration
- [TouchableHaptic](/api/touchable-haptic) — drop-in pressable with haptics
