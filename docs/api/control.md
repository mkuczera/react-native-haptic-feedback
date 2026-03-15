# stop() / isSupported()

## stop()

Stop any ongoing haptic playback.

### Signature

```ts
stop(): void
```

### Platform behaviour

| Platform | Behaviour                                                            |
| -------- | -------------------------------------------------------------------- |
| iOS      | Stops the `CHHapticEngine` pattern player                            |
| Android  | No-op — Android's `Vibrator.cancel()` is unreliable for compositions |

### Usage

```ts
import HapticFeedback from "react-native-haptic-feedback";

// Start a long pattern
HapticFeedback.triggerPattern(pattern("oO=oO=oO"));

// Stop early (iOS only)
HapticFeedback.stop();
```

---

## isSupported()

Synchronously check whether the device supports haptic feedback.

### Signature

```ts
isSupported(): boolean
```

### Returns

| Platform | Returns `true` when…                                         |
| -------- | ------------------------------------------------------------ |
| iOS      | Device supports Core Haptics (iPhone 8 / iOS 13+)            |
| Android  | `Vibrator.hasVibrator()` — device has any vibration hardware |

### Usage

```ts
import HapticFeedback from "react-native-haptic-feedback";

if (HapticFeedback.isSupported()) {
  HapticFeedback.trigger("impactMedium");
}
```

### Notes

- This is a **synchronous** call — suitable for use in render functions and event handlers.
- The result is constant for the lifetime of the app; you do not need to re-check it.
