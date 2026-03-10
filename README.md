# react-native-haptic-feedback

The most complete haptic feedback library for React Native — Core Haptics on iOS, rich Composition API on Android, custom patterns, and a developer-friendly hook.

## Contributions Welcome

[![Contributors](https://contrib.rocks/image?repo=mkuczera/react-native-haptic-feedback)](https://github.com/mkuczera/react-native-haptic-feedback/graphs/contributors)

Made with [contrib.rocks](https://contrib.rocks).

---

## Requirements

| Platform | Minimum version |
|---|---|
| iOS | 13.0 (Core Haptics) |
| Android | API 21 |
| React Native | 0.71.0 |

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
  enableVibrateFallback: true,   // iOS: vibrate if Core Haptics unavailable
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

| Option | Default | Description |
|---|---|---|
| `enableVibrateFallback` | `false` | iOS: use `AudioServicesPlaySystemSound` if Core Haptics not supported |
| `ignoreAndroidSystemSettings` | `false` | Android: trigger even if vibration is disabled in system settings |

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
  time: number;        // ms from pattern start
  type?: 'transient' | 'continuous';
  duration?: number;   // ms — for continuous events only
  intensity?: number;  // 0.0–1.0
  sharpness?: number;  // 0.0–1.0
}
```

### `playAHAP(fileName)`

Play an Apple Haptic and Audio Pattern (`.ahap`) file. iOS only — resolves immediately on Android.

```typescript
RNHapticFeedback.playAHAP(fileName: string): Promise<void>
```

Place `.ahap` files in `<bundle>/haptics/` or the bundle root. Pass the file name without path prefix.

For cross-platform usage, prefer `playHaptic` below.

### `playHaptic(ahapFile, fallback, options?)`

Cross-platform wrapper for AHAP playback. Plays the `.ahap` file on iOS and falls back to a `triggerPattern` call on Android.

```typescript
import { playHaptic, pattern } from 'react-native-haptic-feedback';

// iOS: plays my-effect.ahap
// Android: plays the fallback pattern
await playHaptic('my-effect.ahap', pattern('oO.O'));
```

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

---

## Pattern Notation Helper

Build `HapticEvent[]` from a compact string notation:

| Character | Meaning |
|---|---|
| `o` | Soft transient (intensity 0.4, sharpness 0.4) |
| `O` | Strong transient (intensity 1.0, sharpness 0.8) |
| `.` | 100 ms gap |
| `-` | 300 ms gap |
| `=` | 1000 ms gap |

```typescript
import { pattern, PATTERN_CHARS } from "react-native-haptic-feedback";
import type { PatternChar } from "react-native-haptic-feedback";

RNHapticFeedback.triggerPattern(pattern('oO.O'));
// → soft, strong, 100ms pause, strong
```

`pattern()` throws a `TypeError` if the string contains any character not in `PATTERN_CHARS`. Use `PATTERN_CHARS` for programmatic validation:

```typescript
const valid = [...input].every(c => PATTERN_CHARS.has(c as PatternChar));
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

| Prop | Type | Default | Description |
|---|---|---|---|
| `hapticType` | `HapticFeedbackTypes` | `impactMedium` | Feedback type to play |
| `hapticTrigger` | `'onPressIn' \| 'onPress' \| 'onLongPress'` | `onPressIn` | Which event triggers haptics |
| `hapticOptions` | `HapticOptions` | — | Options forwarded to `trigger()` |

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

|       Type               |  Android  |   iOS   | Notes |
| :----------------------: | :-------: | :-----: |---|
| `impactLight`            | ✅ | ✅ | API 31+: `PRIMITIVE_TICK` |
| `impactMedium`           | ✅ | ✅ | API 31+: `PRIMITIVE_CLICK` |
| `impactHeavy`            | ✅ | ✅ | API 31+: `PRIMITIVE_HEAVY_CLICK` |
| `rigid`                  | ✅ | ✅ | API 31+: `PRIMITIVE_CLICK` (scale 0.9) |
| `soft`                   | ✅ | ✅ | API 31+: `PRIMITIVE_TICK` (scale 0.3) |
| `notificationSuccess`    | ✅ | ✅ | |
| `notificationWarning`    | ✅ | ✅ | |
| `notificationError`      | ✅ | ✅ | |
| `selection`              | ✅ | ✅ | |
| `confirm`                | ✅ | ✅ | Android API 30+: `CONFIRM`; fallback waveform on older |
| `reject`                 | ✅ | ✅ | Android API 30+: `REJECT`; fallback waveform on older |
| `gestureStart`           | ✅ | ✅ | Android API 30+: `GESTURE_START`; fallback waveform on older |
| `gestureEnd`             | ✅ | ✅ | Android API 30+: `GESTURE_END`; fallback waveform on older |
| `segmentTick`            | ✅ | ✅ | Android API 30+: `SEGMENT_TICK`; fallback waveform on older |
| `segmentFrequentTick`    | ✅ | ✅ | Android API 30+: `SEGMENT_FREQUENT_TICK`; fallback waveform on older |
| `toggleOn`               | ✅ | ✅ | Android API 30+: `TOGGLE_ON`; fallback waveform on older |
| `toggleOff`              | ✅ | ✅ | Android API 30+: `TOGGLE_OFF`; fallback waveform on older |
| `clockTick`              | ✅ | ✅ | iOS: Core Haptics approximation |
| `contextClick`           | ✅ | ✅ | iOS: Core Haptics approximation |
| `keyboardPress`          | ✅ | ✅ | iOS: Core Haptics approximation |
| `keyboardRelease`        | ✅ | ✅ | iOS: Core Haptics approximation |
| `keyboardTap`            | ✅ | ✅ | iOS: Core Haptics approximation |
| `longPress`              | ✅ | ✅ | iOS: Core Haptics approximation |
| `textHandleMove`         | ✅ | ✅ | iOS: Core Haptics approximation |
| `virtualKey`             | ✅ | ✅ | iOS: Core Haptics approximation |
| `virtualKeyRelease`      | ✅ | ✅ | iOS: Core Haptics approximation |
| `effectClick`            | ✅ | ✅ | Android API 29+; iOS: Core Haptics approximation |
| `effectDoubleClick`      | ✅ | ✅ | Android API 29+; iOS: Core Haptics approximation |
| `effectHeavyClick`       | ✅ | ✅ | Android API 29+; iOS: Core Haptics approximation |
| `effectTick`             | ✅ | ✅ | Android API 29+; iOS: Core Haptics approximation |

---

## Jest Mock

```typescript
// In your test file:
jest.mock('react-native-haptic-feedback');

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
5. `pattern()` now throws a `TypeError` for invalid characters instead of silently ignoring them.

### Upgrade steps

```bash
# Pre-release (recommended for testing)
npm install react-native-haptic-feedback@next
cd ios && pod install
```

All existing `trigger()` call-sites continue to work without changes. The new `confirm`, `reject`, `gestureStart/End`, `segmentTick/FrequentTick`, `toggleOn/Off` types are additive.

---

## Comparison with other libraries

| Feature | **react-native-haptic-feedback** | [expo-haptics] | [react-native-nitro-haptics] | [@candlefinance/haptics] | [expo-ahap] |
|---|:---:|:---:|:---:|:---:|:---:|
| iOS (Core Haptics) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Android | ✅ | ✅ | ✅ | ⚠️ basic | ❌ |
| Web | ❌ | ✅ | ❌ | ❌ | ❌ |
| Haptic types (count) | **27+** | 10 | 10 | 10 | — |
| Same types on both platforms | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Custom pattern API | ✅ | ❌ | ❌ | ✅ | ❌ |
| Pattern notation string | ✅ `oO.O` | ❌ | ❌ | ✅ | ❌ |
| AHAP file playback | ✅ | ❌ | ❌ | ✅ | ✅ |
| Cross-platform `playHaptic` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `useHaptics` React hook | ✅ | ❌ | ❌ | ❌ | ❌ |
| `TouchableHaptic` component | ✅ | ❌ | ❌ | ❌ | ❌ |
| Global enable / disable | ✅ | ❌ | ❌ | ❌ | ❌ |
| System haptic status query | ✅ | ❌ | ❌ | ❌ | ❌ |
| TypeScript (full) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compile-time pattern check | ✅ | ❌ | ❌ | ❌ | ❌ |
| Built-in Jest mock | ✅ | ❌ | ❌ | ❌ | ❌ |
| Old + New Architecture | ✅ | ✅ | ❌ New only | ✅ | ✅ |

[expo-haptics]: https://docs.expo.dev/versions/latest/sdk/haptics/
[react-native-nitro-haptics]: https://github.com/oblador/react-native-nitro-haptics
[@candlefinance/haptics]: https://github.com/candlefinance/haptics
[expo-ahap]: https://github.com/EvanBacon/expo-ahap

**When to choose something else:**

- **expo-haptics** — you only need the basic 3 impact/notification/selection categories and want official Expo SDK + web support.
- **react-native-nitro-haptics** — you are on New Architecture only and want the lowest possible latency via Nitro modules.
- **@candlefinance/haptics** — you need AHAP playback combined with a pattern notation API and primarily target iOS.
- **expo-ahap** — you only need to play `.ahap` files and nothing else.

---

## Acknowledgements

- [**expo-ahap**](https://github.com/EvanBacon/expo-ahap) by [@EvanBacon](https://github.com/EvanBacon) — the `AhapType` TypeScript definitions exported by this library are modelled after the types in expo-ahap.
- All [contributors](https://github.com/mkuczera/react-native-haptic-feedback/graphs/contributors) who submitted issues and pull requests.

---

## Troubleshooting

**Haptics not firing on iOS simulator** — Core Haptics does not work in the iOS Simulator. Test on a physical device.

**`isSupported()` returns false** — the device does not have a Taptic Engine (iPhone 7 or older without the A9 chip, or iPads). Use `enableVibrateFallback: true` to fall back to system vibration.

**Android vibration seems weak** — upgrade your target device to API 31+ and ensure the device has a high-quality actuator. Use `triggerPattern` with explicit amplitudes for more control.
