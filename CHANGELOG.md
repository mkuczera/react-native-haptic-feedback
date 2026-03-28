# Changelog

## [3.0.0] - 2026-03-28

### Breaking Changes

- **iOS minimum target raised to 13.0** (was 12.4).
- **React Native minimum peer dependency raised to 0.71.0** (was 0.60.0).
- `DeviceUtils` class removed — no longer needed.
- `enableVibrateFallback` on iOS 13+ now operates via the Core Haptics path.

### New Features

#### iOS — Core Haptics engine

- Complete rewrite of iOS module using `CHHapticEngine` (Core Haptics), replacing UIKit feedback generators.
- No more 25-second rate-limiting (#98).
- Eliminates `NSInternalInconsistencyException` crash (#65).
- Fixes `_prepareWithStyle` crash (#143).
- Intensity and sharpness tuned per feedback type; engine restarts automatically after system interruption.
- All 30 haptic types have sensible Core Haptics mappings — no more generic fallback.

#### New haptic types

8 new `HapticFeedbackTypes` values supported on both platforms:

| Type                  | Android                         | iOS |
| --------------------- | ------------------------------- | --- |
| `confirm`             | ✅ (API 30+, waveform fallback) | ✅  |
| `reject`              | ✅ (API 30+, waveform fallback) | ✅  |
| `gestureStart`        | ✅ (API 30+, waveform fallback) | ✅  |
| `gestureEnd`          | ✅ (API 30+, waveform fallback) | ✅  |
| `segmentTick`         | ✅ (API 30+, waveform fallback) | ✅  |
| `segmentFrequentTick` | ✅ (API 30+, waveform fallback) | ✅  |
| `toggleOn`            | ✅ (API 30+, waveform fallback) | ✅  |
| `toggleOff`           | ✅ (API 30+, waveform fallback) | ✅  |

#### New API methods

- `RNHapticFeedback.stop()` — cancel the current haptic player and stop the engine.
- `RNHapticFeedback.isSupported()` — synchronously returns `true` if Core Haptics is available.
- `RNHapticFeedback.triggerPattern(events, options?)` — play a custom sequence of `HapticEvent` objects.
- `RNHapticFeedback.playAHAP(fileName)` — play an `.ahap` file by name (iOS only; resolves immediately on Android).
- `RNHapticFeedback.getSystemHapticStatus()` — returns `{ vibrationEnabled, ringerMode }` on Android (#137).

#### Pattern notation helper

```typescript
import { pattern } from "react-native-haptic-feedback";
RNHapticFeedback.triggerPattern(pattern("oO.O"));
// o = soft transient, O = strong transient, . = 100ms, - = 300ms, = = 1000ms
```

Pattern is type-safe at runtime (`TypeError` on invalid characters) and at compile time via `AssertValidPattern<S>`.

#### `playHaptic` cross-platform bridge

```typescript
import { playHaptic, pattern } from "react-native-haptic-feedback";

// iOS: plays the .ahap file; Android: plays the fallback pattern
await playHaptic("celebration.ahap", pattern("oO.O"));
```

#### Built-in presets

```typescript
import { Patterns } from "react-native-haptic-feedback";
RNHapticFeedback.triggerPattern(Patterns.success);
// success, error, warning, heartbeat, tripleClick, notification
```

#### `useHaptics` React hook

```typescript
import { useHaptics } from "react-native-haptic-feedback";
const haptics = useHaptics({ enableVibrateFallback: true });
haptics.trigger("impactMedium");
await haptics.playHaptic("effect.ahap", pattern("oO.O"));
```

#### `TouchableHaptic` component

```typescript
import { TouchableHaptic } from 'react-native-haptic-feedback';

<TouchableHaptic hapticType="impactMedium" hapticTrigger="onPressIn" onPress={handlePress}>
  <Text>Press me</Text>
</TouchableHaptic>
```

#### `isRingerSilent` utility

```typescript
import { isRingerSilent } from "react-native-haptic-feedback";
const status = await RNHapticFeedback.getSystemHapticStatus();
if (isRingerSilent(status)) {
  /* ringer is off */
}
```

#### Official Jest mock

```typescript
jest.mock("react-native-haptic-feedback");
// All methods are auto-mocked; isSupported() returns true by default.
```

#### Android improvements

- API 26+ guard in `VibrateWithDuration` — fixes Android 8 crash (#88).
- API 31+ uses `VibrationEffect.Composition` for richer haptic primitives.
- `getSystemHapticStatus()` exposes ringer mode and vibrator availability.
- `triggerPattern()` maps `HapticEvent[]` to `VibrationEffect.createWaveform` with amplitude support.

### Bug Fixes

- **#142 / #118** — `_AudioServicesPlaySystemSound` linker error resolved.
- **#115** — Android lambda in `getReactModuleInfoProvider` expanded to anonymous class.
- **#88** — `VibrateWithDuration` uses `VibrationEffect.createWaveform` on API 26+.
- **#143** — `_prepareWithStyle` crash gone (UIKit generators replaced by Core Haptics).
- **#98** — 25-second haptic rate-limit gone (Core Haptics has no such limit).
- **#65** — `NSInternalInconsistencyException` gone (UIKit generators replaced).
- **#77** — `isSupported()` lets app handle iPhone 8 and SE gracefully.
- **Android** — `VibrateWithHapticConstant` was buzzing for `CLOCK_TICK = 4` ms. Fixed by using a hidden 0×0 `View` calling `view.performHapticFeedback(constant)` on the UI thread.
- **Android** — `stop()` was a no-op. Now calls `vibrator.cancel()`.
- **Android** — `effect*` types silent below API 29. Fixed with `VibrateWithDuration` fallbacks.
- **iOS** — `stoppedHandler` / `resetHandler` mutated `nonatomic` properties off the main thread. Fixed by dispatching to main queue.
- **iOS** — `playAHAP` / `getSystemHapticStatus` used wrong selector on new arch. Fixed with `#ifdef RCT_NEW_ARCH_ENABLED` guards.
- **iOS** — `playAHAP` now searches `<bundle>/haptics/` before bundle root.
- **iOS** — `enableVibrateFallback` double-fire on iPhone 6s/7/SE 1st gen. Fixed by removing AudioServices call on the UIKit path.
- **iOS** — UIKit fallback now maps all 30 types to correct generators (restores v2 per-type semantics on older Taptic Engine devices).
- **`useHaptics`** — returned a new object on every render. Fixed with `useMemo`.
- **Jest mock** — `pattern()` and `Patterns` now delegate to real implementations.

---

## [2.3.3] - previous release

See git log for earlier history.
