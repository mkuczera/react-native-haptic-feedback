# Migration — v2 → v3

## Breaking changes

### iOS minimum bumped to 13.0

The library now uses `CHHapticEngine` (Core Haptics) exclusively. Devices running iOS 12.x or earlier are no longer supported.

**Update your Podfile / project minimum deployment target if needed.**

### React Native minimum bumped to 0.71.0

The native module uses the Codegen spec format introduced in RN 0.71. Older versions of React Native are no longer supported.

### `pattern()` timing changed

| v2                                  | v3                                         |
| ----------------------------------- | ------------------------------------------ |
| Transient advances cursor **50 ms** | Transient advances cursor **50 ms** ✓ same |
| `.` added **50 ms**                 | `.` adds **100 ms**                        |
| `-` added **200 ms**                | `-` adds **300 ms**                        |
| `=` added **500 ms**                | `=` adds **1000 ms**                       |

Re-check any hand-tuned pattern strings if the feel has changed.

### `pattern()` throws on invalid characters

In v2, unrecognised characters in a pattern string were silently skipped. In v3, `pattern()` **throws a `TypeError`** for any character not in `{o, O, ., -, =}`.

```ts
// v2 — silently ignored 'x'
pattern("oxO"); // → [{time:0,...},{time:50,...}]

// v3 — throws TypeError
pattern("oxO"); // TypeError: pattern(): invalid character "x" at position 1
```

Wrap any dynamic pattern strings in a try/catch.

### `DeviceUtils` removed

`DeviceUtils.h` and `DeviceUtils.mm` no longer exist. Any native code that imported these files must be updated.

---

## New in v3

### Four new methods

| Method                             | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `triggerPattern(events, options?)` | Play a `HapticEvent[]` sequence                   |
| `stop()`                           | Stop ongoing haptics (iOS only; no-op on Android) |
| `isSupported()`                    | Synchronous device capability check               |
| `playAHAP(fileName)`               | Play an AHAP file (iOS only)                      |
| `getSystemHapticStatus()`          | Query vibration/ringer state                      |

### Cross-platform utilities

- `playHaptic(ahapFile, fallback, options?)` — plays AHAP on iOS, pattern on Android
- `pattern(notation)` — notation string → `HapticEvent[]`
- `Patterns` — six built-in named presets

### React integration

- `useHaptics(defaultOptions?)` hook
- `TouchableHaptic` component (Pressable wrapper)

### 8 new Android types (API 30+)

`confirm`, `reject`, `gestureStart`, `gestureEnd`, `segmentTick`, `segmentFrequentTick`, `toggleOn`, `toggleOff`

### Jest auto-mock

`src/__mocks__/react-native-haptic-feedback.ts` — drop-in test mock for all methods.

---

## Import changes

The default import API is unchanged:

```ts
import HapticFeedback from "react-native-haptic-feedback";
HapticFeedback.trigger("impactMedium");
```

All new features are available as named imports:

```ts
import {
  pattern,
  Patterns,
  playHaptic,
  useHaptics,
  TouchableHaptic,
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
```
