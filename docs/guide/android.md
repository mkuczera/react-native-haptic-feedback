# Android

## API level feature matrix

| API level | Feature                                | Haptic types unlocked                                                                                       |
| :-------: | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
|    21+    | `Vibrator.vibrate(ms)`                 | All basic types                                                                                             |
|    26+    | `VibrationEffect.createWaveform`       | Waveform patterns (`triggerPattern`)                                                                        |
|    29+    | `VibrationEffect.EFFECT_*` constants   | `effectClick`, `effectDoubleClick`, `effectHeavyClick`, `effectTick`                                        |
|    30+    | `View.performHapticFeedback` constants | `confirm`, `reject`, `gestureStart`, `gestureEnd`, `segmentTick`, `segmentFrequentTick`                     |
|    31+    | `VibrationEffect.Composition`          | Richer primitive composition for impact types                                                               |
|    33+    | `VibrationAttributes.USAGE_TOUCH`      | System integrates vibrations with haptic-preference settings                                                |
|    34+    | Additional `HapticFeedbackConstants`   | `toggleOn`, `toggleOff`, `dragStart`, `gestureThresholdActivate`, `gestureThresholdDeactivate`, `noHaptics` |

---

## View-based haptics

The following types use `decorView.performHapticFeedback()` for precise, system-calibrated responses. The library accesses the activity's `decorView` directly — no extra view is added to the layout tree.

### Always-available (API 23+)

| Type                | Android constant      |
| ------------------- | --------------------- |
| `clockTick`         | `CLOCK_TICK`          |
| `contextClick`      | `CONTEXT_CLICK`       |
| `keyboardPress`     | `KEYBOARD_PRESS`      |
| `keyboardRelease`   | `KEYBOARD_RELEASE`    |
| `keyboardTap`       | `KEYBOARD_TAP`        |
| `longPress`         | `LONG_PRESS`          |
| `textHandleMove`    | `TEXT_HANDLE_MOVE`    |
| `virtualKey`        | `VIRTUAL_KEY`         |
| `virtualKeyRelease` | `VIRTUAL_KEY_RELEASE` |

### API 30+ (Android 11)

| Type                  | Android constant        |
| --------------------- | ----------------------- |
| `confirm`             | `CONFIRM`               |
| `reject`              | `REJECT`                |
| `gestureStart`        | `GESTURE_START`         |
| `gestureEnd`          | `GESTURE_END`           |
| `segmentTick`         | `SEGMENT_TICK`          |
| `segmentFrequentTick` | `SEGMENT_FREQUENT_TICK` |

### API 34+ (Android 14)

| Type                         | Android constant               |
| ---------------------------- | ------------------------------ |
| `toggleOn`                   | `TOGGLE_ON`                    |
| `toggleOff`                  | `TOGGLE_OFF`                   |
| `dragStart`                  | `DRAG_START`                   |
| `gestureThresholdActivate`   | `GESTURE_THRESHOLD_ACTIVATE`   |
| `gestureThresholdDeactivate` | `GESTURE_THRESHOLD_DEACTIVATE` |
| `noHaptics`                  | `NO_HAPTICS` (explicit no-op)  |

On devices below the required API level these types fall through to a `VibrationEffect` waveform equivalent.

---

## `VibrationAttributes.USAGE_TOUCH` (API 33+)

On Android 13+, all vibrations are tagged with `VibrationAttributes.USAGE_TOUCH`. This signals to the OS that the vibration is UI feedback, enabling it to respect the user's haptic-feedback preference from system settings.

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
