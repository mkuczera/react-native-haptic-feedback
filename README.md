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

```bash
npm install react-native-haptic-feedback
# or
yarn add react-native-haptic-feedback
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

### `getSystemHapticStatus()`

Android only: returns the device's current ringer mode and whether vibration is available.

```typescript
RNHapticFeedback.getSystemHapticStatus(): Promise<SystemHapticStatus>

interface SystemHapticStatus {
  vibrationEnabled: boolean;
  ringerMode: 'silent' | 'vibrate' | 'normal';
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
import { pattern } from "react-native-haptic-feedback";

RNHapticFeedback.triggerPattern(pattern('oO.O'));
// → soft, strong, 100ms pause, strong
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

## Available Feedback Types

|       Type          |  Android  |   iOS   | Notes |
| :-----------------: | :-------: | :-----: |---|
| `impactLight`       | ✅ | ✅ | API 31+: `PRIMITIVE_TICK` |
| `impactMedium`      | ✅ | ✅ | API 31+: `PRIMITIVE_CLICK` |
| `impactHeavy`       | ✅ | ✅ | API 31+: `PRIMITIVE_HEAVY_CLICK` |
| `rigid`             | ✅ | ✅ | API 31+: `PRIMITIVE_CLICK` (scale 0.9) |
| `soft`              | ✅ | ✅ | API 31+: `PRIMITIVE_TICK` (scale 0.3) |
| `notificationSuccess` | ✅ | ✅ | |
| `notificationWarning` | ✅ | ✅ | |
| `notificationError`   | ✅ | ✅ | |
| `selection`         | ✅ | ✅ | |
| `clockTick`         | ✅ | ❌ | |
| `contextClick`      | ✅ | ❌ | |
| `keyboardPress`     | ✅ | ❌ | |
| `keyboardRelease`   | ✅ | ❌ | |
| `keyboardTap`       | ✅ | ❌ | |
| `longPress`         | ✅ | ❌ | |
| `textHandleMove`    | ✅ | ❌ | |
| `virtualKey`        | ✅ | ❌ | |
| `virtualKeyRelease` | ✅ | ❌ | |
| `effectClick`       | ✅ | ❌ | API 29+ |
| `effectDoubleClick` | ✅ | ❌ | API 29+ |
| `effectHeavyClick`  | ✅ | ❌ | API 29+ |
| `effectTick`        | ✅ | ❌ | API 29+ |

---

## Jest Mock

```typescript
// In your test file:
jest.mock('react-native-haptic-feedback');

// All methods are automatically mocked:
// trigger, stop, isSupported (→ true), triggerPattern, playAHAP (→ Promise.resolve()),
// getSystemHapticStatus (→ { vibrationEnabled: true, ringerMode: 'normal' }),
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
npm install react-native-haptic-feedback@3
cd ios && pod install
```

All existing `trigger()` call-sites continue to work without changes.

---

## Troubleshooting

**Haptics not firing on iOS simulator** — Core Haptics does not work in the iOS Simulator. Test on a physical device.

**`isSupported()` returns false** — the device does not have a Taptic Engine (iPhone 7 or older without the A9 chip, or iPads). Use `enableVibrateFallback: true` to fall back to system vibration.

**Android vibration seems weak** — upgrade your target device to API 31+ and ensure the device has a high-quality actuator. Use `triggerPattern` with explicit amplitudes for more control.
