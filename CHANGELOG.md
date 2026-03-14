# Changelog

## [3.0.0-next.0] - 2026-03-09

This is a pre-release for battle testing. Install with `npm install react-native-haptic-feedback@next`.

### New Features (since 3.0.0 draft)

#### New haptic types
8 new `HapticFeedbackTypes` values supported on both platforms:

| Type | Android | iOS | Notes |
|---|---|---|---|
| `confirm` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.CONFIRM` |
| `reject` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.REJECT` |
| `gestureStart` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.GESTURE_START` |
| `gestureEnd` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.GESTURE_END` |
| `segmentTick` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.SEGMENT_TICK` |
| `segmentFrequentTick` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.SEGMENT_FREQUENT_TICK` |
| `toggleOn` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.TOGGLE_ON` |
| `toggleOff` | ✅ (API 30+) | ✅ | API 30+: `HapticFeedbackConstants.TOGGLE_OFF` |

On Android < API 30 these fall back to `VibrateWithDuration` waveforms.

#### `TouchableHaptic` component
A `Pressable` wrapper that fires haptic feedback on a configurable touch event:
```typescript
import { TouchableHaptic } from 'react-native-haptic-feedback';

<TouchableHaptic
  hapticType="impactMedium"
  hapticTrigger="onPressIn"
  onPress={handlePress}
>
  <Text>Press me</Text>
</TouchableHaptic>
```

#### Pattern type safety + runtime validation
- `PatternChar` type exported: `'o' | 'O' | '.' | '-' | '='`
- `PATTERN_CHARS` set exported for programmatic checks
- `pattern()` now throws a `TypeError` for invalid characters (was silently ignoring them)
```typescript
import { PATTERN_CHARS, pattern } from 'react-native-haptic-feedback';

// Runtime guard
if (![...input].every(c => PATTERN_CHARS.has(c as PatternChar))) {
  // handle invalid input
}

// pattern() throws on bad input
pattern('oX'); // TypeError: pattern(): invalid character "X" at position 1
```

#### `playHaptic` cross-platform bridge
New utility that replaces the iOS-only `playAHAP` for cross-platform use:
```typescript
import { playHaptic, pattern } from 'react-native-haptic-feedback';

// iOS: plays the .ahap file
// Android: plays the fallback pattern
await playHaptic('my-effect.ahap', pattern('oO.O'));
```
`playAHAP` remains available for iOS-specific use cases.

#### All haptic types now work on both platforms
The 13 types that previously had no iOS mapping (falling through to a generic fallback) now have sensible Core Haptics approximations:

| Type | iOS mapping |
|---|---|
| `clockTick` | Sharp subtle tick (0.25/0.9) |
| `contextClick` | Soft medium click (0.4/0.5) |
| `keyboardPress` / `virtualKey` | Light crisp impact (0.3/0.7) |
| `keyboardRelease` / `virtualKeyRelease` | Very light (0.2/0.5) |
| `keyboardTap` | Light crisp impact (0.3/0.7) |
| `longPress` | Heavy diffuse impact (0.7/0.3) |
| `textHandleMove` | Very subtle movement (0.15/0.4) |
| `effectClick` | Standard click (0.5/0.6) |
| `effectDoubleClick` | Two clicks at 0ms + 50ms |
| `effectHeavyClick` | Strong heavy impact (1.0/0.7) |
| `effectTick` | Light sharp tick (0.3/0.8) |

#### `getSystemHapticStatus` — honest iOS response
`ringerMode` is now `null` on iOS (was hardcoded `"normal"`). iOS has no public API to read ringer state. The `SystemHapticStatus` type is updated accordingly:
```typescript
interface SystemHapticStatus {
  vibrationEnabled: boolean;
  ringerMode: 'silent' | 'vibrate' | 'normal' | null; // null on iOS
}
```

### Bug Fixes (since 3.0.0 draft)

- **Android**: `VibrateWithHapticConstant` was passing `HapticFeedbackConstants` integers (e.g. `CLOCK_TICK = 4`) as millisecond durations — device would buzz for 4 ms. Fixed by replacing with a hidden 0×0 `View` that calls `view.performHapticFeedback(constant)` on the UI thread. All view-based haptic types now produce the correct system-defined feel.
- **iOS**: `stoppedHandler` and `resetHandler` modified `nonatomic` properties from CoreHaptics internal threads. Fixed by dispatching property writes to the main queue.
- **iOS**: `playAHAP` and `getSystemHapticStatus` used `resolver:rejecter:` selector on new arch, but codegen expects `resolve:reject:`. Fixed with `#ifdef RCT_NEW_ARCH_ENABLED` guards.
- **iOS**: `playAHAP` now searches `<bundle>/haptics/<fileName>` before falling back to the bundle root, matching the documented path convention.
- **Android `stop()`**: was a no-op. Now calls `vibrator.cancel()` to actually stop ongoing vibration.
- **`useHaptics`**: returned a new object reference on every render. Fixed with `useMemo` keyed on individual option values.
- **Jest mock**: `pattern()` was a reimplemented copy of the real function; `Patterns` was hardcoded. Both now delegate to the real implementations.

---

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
