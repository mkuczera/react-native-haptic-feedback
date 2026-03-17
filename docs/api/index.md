# API Overview

## Default export

```ts
import HapticFeedback from "react-native-haptic-feedback";
```

`HapticFeedback` is an object exposing all methods:

| Method                                                     | Returns                       | Description                     |
| ---------------------------------------------------------- | ----------------------------- | ------------------------------- |
| [`trigger(type, options?)`](/api/trigger)                  | `void`                        | Fire a single haptic            |
| [`impact(type?, intensity?, options?)`](/api/impact)       | `void`                        | Haptic with custom intensity    |
| [`triggerPattern(events, options?)`](/api/trigger-pattern) | `void`                        | Play a `HapticEvent[]` sequence |
| [`stop()`](/api/control)                                   | `void`                        | Stop ongoing haptics (iOS)      |
| [`isSupported()`](/api/control)                            | `boolean`                     | Synchronous capability check    |
| [`playAHAP(fileName)`](/api/play-ahap)                     | `Promise<void>`               | Play an AHAP file — iOS only    |
| [`getSystemHapticStatus()`](/api/system-status)            | `Promise<SystemHapticStatus>` | Query ringer/vibration state    |
| [`setEnabled(value)`](/api/enabled)                        | `void`                        | Library-wide kill switch        |
| [`isEnabled()`](/api/enabled)                              | `boolean`                     | Read the kill-switch state      |

---

## Named exports

```ts
import {
  trigger,
  impact,
  stop,
  isSupported,
  triggerPattern,
  playAHAP,
  getSystemHapticStatus,
  setEnabled,
  isEnabled,
  playHaptic,
  pattern,
  Patterns,
  useHaptics,
  TouchableHaptic,
  HapticFeedbackTypes,
  isRingerSilent,
} from "react-native-haptic-feedback";
```

All methods from the default export are also available as named exports.

---

## React hooks & components

| Export                                            | Description                                            |
| ------------------------------------------------- | ------------------------------------------------------ |
| [`useHaptics(defaultOptions?)`](/api/use-haptics) | Hook with merged default options and stable references |
| [`TouchableHaptic`](/api/touchable-haptic)        | Pressable wrapper with built-in haptic                 |

---

## Utilities

| Export                                                     | Description                               |
| ---------------------------------------------------------- | ----------------------------------------- |
| [`pattern(notation)`](/api/pattern)                        | Convert notation string → `HapticEvent[]` |
| [`Patterns`](/api/presets)                                 | Six named built-in presets                |
| [`playHaptic(ahap, fallback, options?)`](/api/play-haptic) | Cross-platform AHAP/pattern bridge        |
| [`isRingerSilent(status)`](/api/types#isringersilent)      | Helper for `SystemHapticStatus`           |

---

## Types

| Export                                                  | Description                                            |
| ------------------------------------------------------- | ------------------------------------------------------ |
| [`HapticFeedbackTypes`](/api/types#hapticfeedbacktypes) | Enum of all 34 haptic type strings                     |
| [`HapticOptions`](/api/types#hapticoptions)             | `enableVibrateFallback`, `ignoreAndroidSystemSettings` |
| [`HapticEvent`](/api/types#hapticevent)                 | Single event in a pattern sequence                     |
| [`SystemHapticStatus`](/api/types#systemhapticstatus)   | Result of `getSystemHapticStatus()`                    |
| [`AhapType`](/api/types#ahap-types-ios-only)            | Full AHAP document — iOS only                          |
| [`PatternChar`](/api/types#patternchar)                 | `'o' \| 'O' \| '.' \| '-' \| '='`                      |
