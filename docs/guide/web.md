# Web Support

The library ships a `.web.ts` platform implementation that routes to the [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) (`navigator.vibrate`).

## How it works

Metro, webpack, and other React Native bundlers pick up `hapticFeedback.web.ts` automatically for web builds via the `.web` extension convention. No extra configuration is needed.

## Browser support

The Web Vibration API is supported in most Android browsers (Chrome, Firefox, Samsung Internet) and is **not supported** in Safari or Firefox for iOS. On unsupported browsers all haptic calls silently no-op.

| Browser              | Vibration API |
| -------------------- | :-----------: |
| Chrome Android       |       ✓       |
| Firefox Android      |       ✓       |
| Samsung Internet     |       ✓       |
| Safari (iOS / macOS) |       ✗       |
| Chrome desktop       |       ✗       |
| Firefox desktop      |       ✗       |

## Behaviour differences

| Feature          | Mobile                            | Web                                             |
| ---------------- | --------------------------------- | ----------------------------------------------- |
| `trigger()`      | System-calibrated haptic per type | Fixed-duration `navigator.vibrate(ms)` per type |
| `impact()`       | Custom CHHapticEngine / amplitude | Fixed duration (intensity ignored by Web API)   |
| `triggerPattern` | CHHapticEngine / VibrationEffect  | `navigator.vibrate([gap, dur, gap, dur, …])`    |
| `stop()`         | Cancels CHHapticEngine / Vibrator | `navigator.vibrate(0)`                          |
| `isSupported()`  | Checks hardware / CHHapticEngine  | `'vibrate' in navigator`                        |
| `playAHAP()`     | iOS only                          | Resolves immediately (no-op)                    |

## `isSupported()` on web

```ts
import { isSupported } from "react-native-haptic-feedback";

if (isSupported()) {
  // navigator.vibrate is available
}
```

## Checking support before use

Because browsers do not expose vibration amplitude, `impact()` falls back to a fixed duration on web. If precise intensity is important, gate on platform:

```ts
import { Platform } from "react-native";
import { impact } from "react-native-haptic-feedback";

if (Platform.OS !== "web") {
  impact("impactMedium", 0.3); // precise on iOS / Android
} else {
  impact("impactMedium"); // web: fixed duration, intensity ignored
}
```
