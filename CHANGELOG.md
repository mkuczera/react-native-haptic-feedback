# Changelog

## [3.0.0] - 2026-03-07

### Breaking Changes

- **iOS minimum target raised to 13.0** (was 12.4). Drops support for iPhone 6S / 6S+ AudioToolbox workaround.
- **React Native minimum peer dependency raised to 0.71.0** (was 0.60.0).
- `DeviceUtils` class removed — no longer needed.
- `enableVibrateFallback` now triggers `AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)` via CoreHaptics path (previously used UIKit generators).

### New Features

#### iOS — Core Haptics engine
- Complete rewrite of iOS module using `CHHapticEngine` (Core Haptics), replacing UIKit feedback generators.
- No more 25-second rate-limiting (#98).
- Eliminates `NSInternalInconsistencyException` crash (#65).
- Fixes `_prepareWithStyle` crash (#143).
- Intensity and sharpness values tuned per feedback type.
- Engine restarts automatically after system interruption.

#### New API methods
- `RNHapticFeedback.stop()` — cancel the current haptic player and stop the engine.
- `RNHapticFeedback.isSupported()` — synchronously returns `true` if Core Haptics is available on the device.
- `RNHapticFeedback.triggerPattern(events, options?)` — play a custom sequence of `HapticEvent` objects.
- `RNHapticFeedback.playAHAP(fileName)` — play an Apple Haptic and Audio Pattern (`.ahap`) file by name (iOS only; resolves immediately on Android).
- `RNHapticFeedback.getSystemHapticStatus()` — returns `{ vibrationEnabled, ringerMode }` on Android (#137).

#### Pattern notation helper
```typescript
import { pattern } from 'react-native-haptic-feedback';
RNHapticFeedback.triggerPattern(pattern('oO.O'));
// o = soft transient, O = strong transient, . = 100ms, - = 300ms, = = 1000ms
```

#### Built-in presets
```typescript
import { Patterns } from 'react-native-haptic-feedback';
RNHapticFeedback.triggerPattern(Patterns.success);
// success, error, warning, heartbeat, tripleClick, notification
```

#### `useHaptics` React hook
```typescript
import { useHaptics } from 'react-native-haptic-feedback';
const haptics = useHaptics({ enableVibrateFallback: true });
haptics.trigger('impactMedium');
```

#### Official Jest mock
```typescript
jest.mock('react-native-haptic-feedback');
// All methods are auto-mocked; isSupported() returns true by default.
```

#### Android improvements
- API 26+ guard in `VibrateWithDuration` — fixes Android 8 crash (#88).
- API 31+ uses `VibrationEffect.Composition` for richer haptic primitives (`impactLight` → `PRIMITIVE_TICK`, `impactHeavy` → `PRIMITIVE_HEAVY_CLICK`, etc.).
- `getSystemHapticStatus()` exposes ringer mode and vibrator availability.
- `triggerPattern()` maps `HapticEvent[]` to `VibrationEffect.createWaveform` with amplitude support.

### Bug Fixes

- **#142 / #118** — `_AudioServicesPlaySystemSound` linker error resolved (AudioToolbox added as explicit framework; removed from new iOS path).
- **#115** — Android lambda in `getReactModuleInfoProvider` expanded to anonymous class (fixes build on some toolchains).
- **#88** — `VibrateWithDuration` now uses `VibrationEffect.createWaveform` on API 26+.
- **#143** — `_prepareWithStyle` crash gone (UIKit generators replaced by Core Haptics).
- **#98** — 25-second haptic rate-limit gone (Core Haptics has no such limit).
- **#65** — `NSInternalInconsistencyException` gone (UIKit generators replaced).
- **#77** — `isSupported()` lets app handle iPhone 8 and SE gracefully; vibrate fallback still works.

---

## [2.3.3] - previous release

See git log for earlier history.
