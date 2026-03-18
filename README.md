# react-native-haptic-feedback

The most complete haptic feedback library for React Native — Core Haptics on iOS, rich Composition API on Android, custom patterns, and a developer-friendly hook.

[![GitHub Sponsors](https://img.shields.io/github/sponsors/mkuczera?label=Sponsor&logo=GitHub)](https://github.com/sponsors/mkuczera)
[![npm](https://img.shields.io/npm/v/react-native-haptic-feedback)](https://www.npmjs.com/package/react-native-haptic-feedback)
[![npm downloads](https://img.shields.io/npm/dm/react-native-haptic-feedback)](https://www.npmjs.com/package/react-native-haptic-feedback)

If this library saves you time, consider [sponsoring its development](https://github.com/sponsors/mkuczera). ⭐

## Contributions Welcome

[![Contributors](https://contrib.rocks/image?repo=mkuczera/react-native-haptic-feedback)](https://github.com/mkuczera/react-native-haptic-feedback/graphs/contributors)

Made with [contrib.rocks](https://contrib.rocks).

---

## Requirements

| Platform     | Minimum version             |
| ------------ | --------------------------- |
| iOS          | 13.0 (Core Haptics)         |
| Android      | API 23 (Android 6.0)        |
| React Native | 0.71.0                      |
| Web          | Browsers with Vibration API |

---

## Installation

**Stable (v2):**

```bash
npm install react-native-haptic-feedback
# or
yarn add react-native-haptic-feedback
```

**Pre-release (v3 — battle testing):**

```bash
npm install react-native-haptic-feedback@next
# or
yarn add react-native-haptic-feedback@next
```

React Native 0.71+ uses auto-linking — no extra steps needed.

---

## Basic Usage

```typescript
import RNHapticFeedback from "react-native-haptic-feedback";

RNHapticFeedback.trigger("impactMedium");

// With options
RNHapticFeedback.trigger("notificationSuccess", {
  enableVibrateFallback: true, // iOS: vibrate if Core Haptics unavailable
  ignoreAndroidSystemSettings: false,
});
```

Named exports are also available:

```typescript
import { trigger } from "react-native-haptic-feedback";
trigger("impactLight");
```

---

## API Reference

### `trigger(type, options?)`

Play a predefined haptic type.

```typescript
RNHapticFeedback.trigger(type: HapticFeedbackTypes | string, options?: HapticOptions): void
```

| Option                        | Default | Description                                                                                                                                                                                                  |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enableVibrateFallback`       | `false` | iOS: play `AudioServicesPlaySystemSound` as a last resort on devices with no Taptic Engine (e.g. iPod touch). Has no effect on devices that have a Taptic Engine — those use UIKit generators automatically. |
| `ignoreAndroidSystemSettings` | `false` | Android: trigger even if vibration is disabled in system settings                                                                                                                                            |

### `impact(type?, intensity?, options?)`

Play a haptic with a **custom intensity** (0.0–1.0). On iOS the intensity is applied precisely via `CHHapticEngine`; on Android it maps to `VibrationEffect` amplitude.

```typescript
RNHapticFeedback.impact(
  type?: HapticFeedbackTypes,   // default: 'impactMedium'
  intensity?: number,            // 0.0–1.0, default: 0.7
  options?: HapticOptions
): void
```

```typescript
import { impact } from "react-native-haptic-feedback";

impact("impactHeavy", 0.3); // gentle heavy tap
impact("rigid", 1.0); // full-force crisp tap
```

---

### `stop()`

Cancel the current haptic player and stop the engine.

```typescript
RNHapticFeedback.stop(): void
```

### `isSupported()`

Synchronously returns `true` if Core Haptics is supported on the device (iOS 13+ hardware). Always returns `true` on Android if the device has a vibrator.

```typescript
RNHapticFeedback.isSupported(): boolean
```

### `triggerPattern(events, options?)`

Play a custom sequence of haptic events.

```typescript
RNHapticFeedback.triggerPattern(events: HapticEvent[], options?: HapticOptions): void
```

```typescript
interface HapticEvent {
  time: number; // ms from pattern start
  type?: "transient" | "continuous";
  duration?: number; // ms — for continuous events only
  intensity?: number; // 0.0–1.0
  sharpness?: number; // 0.0–1.0
}
```

### `playAHAP(fileName)`

Play an Apple Haptic and Audio Pattern (`.ahap`) file. iOS only — resolves immediately on Android.

```typescript
RNHapticFeedback.playAHAP(fileName: string): Promise<void>
```

Pass the file name (e.g. `"heartbeat.ahap"`) without any path prefix. The native code searches for the file in two locations, in order:

1. A `haptics/` subdirectory inside the app bundle
2. The bundle root

For cross-platform usage, prefer `playHaptic` below.

#### Setting up AHAP files in Xcode

AHAP files must be added to the iOS app bundle — they are **not** bundled by Metro or CocoaPods. Follow these steps:

1. **Create a `haptics/` folder** inside your Xcode project directory (e.g. `ios/YourApp/haptics/`).

2. **Place your `.ahap` files** in that folder:

```
ios/YourApp/haptics/
├── heartbeat.ahap
├── rumble.ahap
└── celebration.ahap
```

3. **Add the files to Xcode:**
   - Open your `.xcworkspace` in Xcode
   - Right-click your app target in the project navigator → **Add Files to "YourApp"**
   - Select the `.ahap` files (or the entire `haptics/` folder)
   - Make sure **"Copy items if needed"** is unchecked (files are already in the project directory)
   - Make sure your **app target is checked** under "Add to targets"

4. **Verify they appear in Build Phases:**
   - Select your app target → **Build Phases** → **Copy Bundle Resources**
   - All `.ahap` files should be listed there. If not, click **+** and add them.

Once added, the files are bundled into the app at build time and `playAHAP("heartbeat.ahap")` will find them.

#### AHAP file format

An `.ahap` file is a JSON document describing haptic events. Here's a minimal example:

```json
{
  "Version": 1.0,
  "Pattern": [
    {
      "Event": {
        "EventType": "HapticTransient",
        "Time": 0.0,
        "EventParameters": [
          { "ParameterID": "HapticIntensity", "ParameterValue": 0.5 },
          { "ParameterID": "HapticSharpness", "ParameterValue": 0.3 }
        ]
      }
    },
    {
      "Event": {
        "EventType": "HapticTransient",
        "Time": 0.15,
        "EventParameters": [
          { "ParameterID": "HapticIntensity", "ParameterValue": 1.0 },
          { "ParameterID": "HapticSharpness", "ParameterValue": 0.5 }
        ]
      }
    }
  ]
}
```

See Apple's [Representing Haptic Patterns in AHAP Files](https://developer.apple.com/documentation/corehaptics/representing_haptic_patterns_in_ahap_files) for the full specification. You can also design patterns visually using the **Haptic Sampler** section in Xcode's Core Haptics tools.

### `playHaptic(ahapFile, fallback, options?)`

Cross-platform wrapper for AHAP playback. Plays the `.ahap` file on iOS and falls back to a `triggerPattern` call on Android.

```typescript
import { playHaptic, pattern } from "react-native-haptic-feedback";

// iOS: plays my-effect.ahap via Core Haptics
// Android: plays the fallback pattern via Vibrator API
await playHaptic("my-effect.ahap", pattern("oO.O"));
```

This is the recommended approach for cross-platform apps — design your haptic in an `.ahap` file for the best iOS experience, and provide a `pattern()` fallback for Android.

### `getSystemHapticStatus()`

Returns the device's haptic availability and — on Android — current ringer mode.

```typescript
RNHapticFeedback.getSystemHapticStatus(): Promise<SystemHapticStatus>

interface SystemHapticStatus {
  vibrationEnabled: boolean;
  /** Android: 'silent' | 'vibrate' | 'normal'. iOS: null (not exposed by the OS). */
  ringerMode: 'silent' | 'vibrate' | 'normal' | null;
}
```

Use the `isRingerSilent` helper to check for silent mode:

```typescript
import {
  getSystemHapticStatus,
  isRingerSilent,
} from "react-native-haptic-feedback";

const status = await getSystemHapticStatus();
if (isRingerSilent(status)) {
  // Android: ringer is silent — show a visual indicator instead
}
// iOS: ringerMode is always null (not exposed by the OS), so isRingerSilent returns false
```

### `setEnabled(value)` / `isEnabled()`

Library-wide kill switch. When disabled, all `trigger`, `triggerPattern`, `playAHAP`, `playHaptic`, and `stop` calls become no-ops.

```typescript
import RNHapticFeedback from "react-native-haptic-feedback";

// Respect user's in-app haptics preference
RNHapticFeedback.setEnabled(userPreference.hapticsEnabled);

// Check current state
if (RNHapticFeedback.isEnabled()) {
  /* ... */
}
```

The setting is in-memory only — persist it yourself (e.g. AsyncStorage) if it should survive app restarts.

---

## Pattern Notation Helper

Build `HapticEvent[]` from a compact string notation:

| Character | Meaning                                         | Time advance | Total `O_O` spacing |
| --------- | ----------------------------------------------- | ------------ | ------------------- |
| `o`       | Soft transient (intensity 0.4, sharpness 0.4)   | 100 ms       | —                   |
| `O`       | Strong transient (intensity 1.0, sharpness 0.8) | 100 ms       | —                   |
| `.`       | Short gap                                       | +150 ms      | 250 ms              |
| `-`       | Medium gap                                      | +400 ms      | 500 ms              |
| `=`       | Long gap                                        | +1000 ms     | 1100 ms             |

Consecutive haptic events (`OO`) are spaced 100 ms apart — the minimum interval the Taptic Engine (iOS) and vibrator motors (Android) can render as distinct pulses. Gap characters add progressively more space on top: `.` for a short beat (250 ms), `-` for a half-second pause, `=` for a full second rest.

```typescript
import { pattern, PATTERN_CHARS } from "react-native-haptic-feedback";
import type { PatternChar } from "react-native-haptic-feedback";

RNHapticFeedback.triggerPattern(pattern("oO.O"));
// → soft, strong, 100ms pause, strong
```

`pattern()` throws a `TypeError` at runtime if the string contains any character not in `PATTERN_CHARS`.

**Compile-time validation:** When you pass a string literal, TypeScript catches invalid characters before runtime:

```typescript
import type { AssertValidPattern } from "react-native-haptic-feedback";

pattern("oO.O"); // ✅ compiles
pattern("oXO"); // ✗ TypeScript error — 'X' is not a valid PatternChar
```

This works automatically — no extra setup needed. If the argument is a runtime `string` variable (not a literal), validation happens at runtime via `TypeError` instead.

**Programmatic validation** — use `PATTERN_CHARS` to check user input before calling `pattern()`:

```typescript
import { PATTERN_CHARS } from "react-native-haptic-feedback";
import type { PatternChar } from "react-native-haptic-feedback";

const valid = [...input].every((c) => PATTERN_CHARS.has(c as PatternChar));
```

---

## Built-in Presets

```typescript
import { Patterns } from "react-native-haptic-feedback";

RNHapticFeedback.triggerPattern(Patterns.success);
RNHapticFeedback.triggerPattern(Patterns.error);
RNHapticFeedback.triggerPattern(Patterns.warning);
RNHapticFeedback.triggerPattern(Patterns.heartbeat);
RNHapticFeedback.triggerPattern(Patterns.tripleClick);
RNHapticFeedback.triggerPattern(Patterns.notification);
```

---

## `useHaptics` Hook

```typescript
import { useHaptics } from "react-native-haptic-feedback";

function MyButton() {
  const haptics = useHaptics({ enableVibrateFallback: true });

  return (
    <Pressable onPress={() => haptics.trigger('impactMedium')}>
      Press me
    </Pressable>
  );
}
```

The hook accepts default options that are merged with per-call overrides.

---

## `TouchableHaptic` Component

A drop-in `Pressable` wrapper that automatically triggers haptic feedback. Accepts all standard `PressableProps` plus three extra props:

| Prop            | Type                                        | Default        | Description                      |
| --------------- | ------------------------------------------- | -------------- | -------------------------------- |
| `hapticType`    | `HapticFeedbackTypes`                       | `impactMedium` | Feedback type to play            |
| `hapticTrigger` | `'onPressIn' \| 'onPress' \| 'onLongPress'` | `onPressIn`    | Which event triggers haptics     |
| `hapticOptions` | `HapticOptions`                             | —              | Options forwarded to `trigger()` |

```typescript
import { TouchableHaptic } from "react-native-haptic-feedback";

<TouchableHaptic
  hapticType="impactMedium"
  hapticTrigger="onPressIn"
  onPress={handlePress}
  style={styles.button}
>
  <Text>Press me</Text>
</TouchableHaptic>
```

---

## Available Feedback Types

|             Type             | Android | iOS | Notes                                                                |
| :--------------------------: | :-----: | :-: | -------------------------------------------------------------------- |
|        `impactLight`         |   ✅    | ✅  | API 31+: `PRIMITIVE_TICK`                                            |
|        `impactMedium`        |   ✅    | ✅  | API 31+: `PRIMITIVE_CLICK`                                           |
|        `impactHeavy`         |   ✅    | ✅  | API 31+: `PRIMITIVE_HEAVY_CLICK`                                     |
|           `rigid`            |   ✅    | ✅  | API 31+: `PRIMITIVE_CLICK` (scale 0.9)                               |
|            `soft`            |   ✅    | ✅  | API 31+: `PRIMITIVE_TICK` (scale 0.3)                                |
|    `notificationSuccess`     |   ✅    | ✅  |                                                                      |
|    `notificationWarning`     |   ✅    | ✅  |                                                                      |
|     `notificationError`      |   ✅    | ✅  |                                                                      |
|         `selection`          |   ✅    | ✅  |                                                                      |
|          `confirm`           |   ✅    | ✅  | Android API 30+: `CONFIRM`; fallback waveform on older               |
|           `reject`           |   ✅    | ✅  | Android API 30+: `REJECT`; fallback waveform on older                |
|        `gestureStart`        |   ✅    | ✅  | Android API 30+: `GESTURE_START`; fallback waveform on older         |
|         `gestureEnd`         |   ✅    | ✅  | Android API 30+: `GESTURE_END`; fallback waveform on older           |
|        `segmentTick`         |   ✅    | ✅  | Android API 30+: `SEGMENT_TICK`; fallback waveform on older          |
|    `segmentFrequentTick`     |   ✅    | ✅  | Android API 30+: `SEGMENT_FREQUENT_TICK`; fallback waveform on older |
|          `toggleOn`          |   ✅    | ✅  | Android API 34+: `TOGGLE_ON`; fallback waveform on older             |
|         `toggleOff`          |   ✅    | ✅  | Android API 34+: `TOGGLE_OFF`; fallback waveform on older            |
|         `dragStart`          |   ✅    | ✅  | Android API 34+: `DRAG_START`; fallback waveform on older            |
|  `gestureThresholdActivate`  |   ✅    | ✅  | Android API 34+: `GESTURE_THRESHOLD_ACTIVATE`; fallback on older     |
| `gestureThresholdDeactivate` |   ✅    | ✅  | Android API 34+: `GESTURE_THRESHOLD_DEACTIVATE`; fallback on older   |
|         `noHaptics`          |   ✅    | ✅  | Android API 34+: `NO_HAPTICS` (explicit no-op)                       |
|         `clockTick`          |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|        `contextClick`        |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|       `keyboardPress`        |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|      `keyboardRelease`       |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|        `keyboardTap`         |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|         `longPress`          |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|       `textHandleMove`       |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|         `virtualKey`         |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|     `virtualKeyRelease`      |   ✅    | ✅  | iOS: Core Haptics approximation                                      |
|        `effectClick`         |   ✅    | ✅  | Android API 29+; iOS: Core Haptics approximation                     |
|     `effectDoubleClick`      |   ✅    | ✅  | Android API 29+; iOS: Core Haptics approximation                     |
|      `effectHeavyClick`      |   ✅    | ✅  | Android API 29+; iOS: Core Haptics approximation                     |
|         `effectTick`         |   ✅    | ✅  | Android API 29+; iOS: Core Haptics approximation                     |

---

## Platform internals

Understanding how each haptic type is rendered helps when diagnosing unexpected behaviour on specific devices.

### iOS — three-tier fallback chain

Every `trigger()` call on iOS walks this chain and stops at the first tier that succeeds:

| Tier                     | Hardware requirement                                | What fires                                                                                                                       |
| ------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **1 — Core Haptics**     | iPhone 8+ / iPad Pro (iOS 13+)                      | `CHHapticEngine` — full per-type patterns with custom intensity & sharpness                                                      |
| **2 — UIKit generators** | Taptic Engine (iPhone 6s, 7, SE 1st gen on iOS 13+) | `UIImpactFeedbackGenerator` / `UINotificationFeedbackGenerator` / `UISelectionFeedbackGenerator` — per-type, semantically mapped |
| **3 — Audio vibration**  | Any device                                          | `AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)` — **only fires if `enableVibrateFallback: true`**                         |

Tier 3 exists for devices with no Taptic Engine at all (e.g. iPod touch 7th gen). On any device with a Taptic Engine, Tier 2 handles it and Tier 3 is unnecessary.

**UIKit semantic mapping (Tier 2):**

| UIKit generator                             | Types                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `UINotificationFeedbackGenerator(.success)` | `notificationSuccess`                                                                                                           |
| `UINotificationFeedbackGenerator(.warning)` | `notificationWarning`                                                                                                           |
| `UINotificationFeedbackGenerator(.error)`   | `notificationError`, `reject`                                                                                                   |
| `UIImpactFeedbackGenerator(.light)`         | `impactLight`, `soft`, `effectTick`, `clockTick`, `gestureStart`, `segmentTick`, `segmentFrequentTick`, `textHandleMove`        |
| `UIImpactFeedbackGenerator(.medium)`        | `impactMedium`, `confirm`, `toggleOn`, `toggleOff`, `effectClick`, `effectDoubleClick` and all other types                      |
| `UIImpactFeedbackGenerator(.heavy)`         | `impactHeavy`, `rigid`, `effectHeavyClick`, `longPress`                                                                         |
| `UISelectionFeedbackGenerator`              | `selection`, `keyboardPress`, `keyboardRelease`, `keyboardTap`, `virtualKey`, `virtualKeyRelease`, `gestureEnd`, `contextClick` |

### Android — two-tier fallback chain

| Tier                            | API level                           | What fires                                                                                                                               |
| ------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **1 — `performHapticFeedback`** | All (via `HapticFeedbackConstants`) | System-quality haptic constant via the activity's `decorView` — respects user system settings unless `ignoreAndroidSystemSettings: true` |
| **2 — Vibrator API**            | API 23+                             | `VibrationEffect.createWaveform` (API 26+) or raw waveform; API 31+ uses `VibrationEffect.Composition` primitives for richer quality     |

Tier 1 is skipped when `ignoreAndroidSystemSettings: true` (because `performHapticFeedback` cannot override system settings), falling directly to Tier 2.

**Android API-level progression:**

| API | Improvement                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------- |
| 23  | Raw waveform vibration (minimum supported)                                                           |
| 26  | `VibrationEffect.createWaveform` with per-step amplitudes                                            |
| 29  | `VibrationEffect.createPredefined` for `effect*` types                                               |
| 30  | `HapticFeedbackConstants` for `confirm`, `reject`, `gesture*`, `segment*`                            |
| 31  | `VibrationEffect.Composition` primitives (richer impact feel)                                        |
| 33  | `VibrationAttributes.USAGE_TOUCH` — vibrations respect system haptic-preference settings             |
| 34  | `HapticFeedbackConstants` for `toggleOn`, `toggleOff`, `dragStart`, `gestureThreshold*`, `noHaptics` |

---

## Jest Mock

```typescript
// In your test file:
jest.mock("react-native-haptic-feedback");

// All methods are automatically mocked:
// trigger, stop, isSupported (→ true), triggerPattern, playAHAP (→ Promise.resolve()),
// getSystemHapticStatus (→ { vibrationEnabled: true, ringerMode: 'normal' } on Android, ringerMode: null on iOS),
// useHaptics, pattern, Patterns
```

---

## Migrating from v2 to v3

### Breaking changes

1. **iOS minimum target is now 13.0** — remove any `<13.0` deployment-target overrides.
2. **React Native minimum is 0.71** — update your peer dependency if needed.
3. The internal `DeviceUtils` class is removed — if you referenced it directly, remove those imports.
4. `enableVibrateFallback` on devices without Core Haptics now calls `kSystemSoundID_Vibrate` instead of the UIKit generator path.

### Upgrade steps

```bash
# Pre-release (recommended for testing)
npm install react-native-haptic-feedback@next
cd ios && pod install
```

All existing `trigger()` call-sites continue to work without changes. The new `confirm`, `reject`, `gestureStart/End`, `segmentTick/FrequentTick`, `toggleOn/Off` types are additive.

---

## Acknowledgements

- [**expo-ahap**](https://github.com/EvanBacon/expo-ahap) by [@EvanBacon](https://github.com/EvanBacon) — the `AhapType` TypeScript definitions exported by this library are modelled after the types in expo-ahap.
- All [contributors](https://github.com/mkuczera/react-native-haptic-feedback/graphs/contributors) who submitted issues and pull requests.

---

## Troubleshooting

**Haptics not firing on iOS simulator** — Core Haptics does not work in the iOS Simulator. Test on a physical device.

**`isSupported()` returns false** — the device does not have a Taptic Engine (iPhone 7 or older without the A9 chip, or iPads). Use `enableVibrateFallback: true` to fall back to system vibration.

**Android vibration seems weak** — upgrade your target device to API 31+ and ensure the device has a high-quality actuator. Use `triggerPattern` with explicit amplitudes for more control.
