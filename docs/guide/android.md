# Android

## API level feature matrix

| API level | Feature                                | Haptic types unlocked                                                                                            |
| :-------: | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
|    21+    | `Vibrator.vibrate(ms)`                 | All basic types                                                                                                  |
|    26+    | `VibrationEffect.createWaveform`       | Waveform patterns (`triggerPattern`)                                                                             |
|    29+    | `VibrationEffect.EFFECT_*` constants   | `effectClick`, `effectDoubleClick`, `effectHeavyClick`, `effectTick`                                             |
|    30+    | `View.performHapticFeedback` constants | `confirm`, `reject`, `gestureStart`, `gestureEnd`, `segmentTick`, `segmentFrequentTick`, `toggleOn`, `toggleOff` |
|    31+    | `VibrationEffect.Composition`          | Richer primitive composition                                                                                     |

---

## View-based haptics (API 30+)

The following types use `View.performHapticFeedback()` for precise, system-calibrated responses:

| Type                  | Android constant        |
| --------------------- | ----------------------- |
| `confirm`             | `CONFIRM`               |
| `reject`              | `REJECT`                |
| `gestureStart`        | `GESTURE_START`         |
| `gestureEnd`          | `GESTURE_END`           |
| `segmentTick`         | `SEGMENT_TICK`          |
| `segmentFrequentTick` | `SEGMENT_FREQUENT_TICK` |
| `toggleOn`            | `TOGGLE_ON`             |
| `toggleOff`           | `TOGGLE_OFF`            |

On devices below API 30 these fall through to a `VibrationEffect` waveform equivalent.

---

## `ignoreAndroidSystemSettings`

By default the library respects the device's ringer/vibration mode. Set this option to `true` to play haptics even when the device is on silent or vibrate-only mode.

```ts
HapticFeedback.trigger("impactMedium", {
  ignoreAndroidSystemSettings: true,
});
```

::: warning User expectation
Overriding system settings should be reserved for critical feedback (e.g. alarm, accessibility). Respect user preferences where possible.
:::

---

## `getSystemHapticStatus()`

```ts
const status = await HapticFeedback.getSystemHapticStatus();

status.vibrationEnabled; // true if device has vibrator and is not in silent mode
status.ringerMode; // 'normal' | 'vibrate' | 'silent' | null
```

The `ringerMode` field reflects Android's `AudioManager` ringer mode. It is always `null` on iOS.

---

## `isSupported()`

Returns `vibrator.hasVibrator()` — `true` if the device has any vibration hardware.

---

## `stop()`

`stop()` is a **no-op** on Android. Android's `Vibrator.cancel()` cancels one-shots but not compositions; calling it for pattern playback is unreliable, so the method intentionally does nothing.

---

## Permissions

No `VIBRATE` permission is needed for `VibrationEffect` on modern Android. For very old targets (API < 26) you may need:

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.VIBRATE" />
```
