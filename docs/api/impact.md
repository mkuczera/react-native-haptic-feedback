# impact()

Play a haptic with a **custom intensity** value (0.0–1.0).

On iOS (Core Haptics), the intensity is applied precisely by `CHHapticEngine`. On Android it maps to `VibrationEffect` amplitude. On devices without haptic hardware this is a no-op.

## Signature

```ts
function impact(
  type?: keyof typeof HapticFeedbackTypes | HapticFeedbackTypes,
  intensity?: number,
  options?: HapticOptions,
): void;
```

## Parameters

| Parameter   | Type                  | Default          | Description                                               |
| ----------- | --------------------- | ---------------- | --------------------------------------------------------- |
| `type`      | `HapticFeedbackTypes` | `'impactMedium'` | Determines the base character (sharpness) of the feedback |
| `intensity` | `number`              | `0.7`            | Haptic strength from `0.0` (silent) to `1.0` (maximum)    |
| `options`   | `HapticOptions`       | `{}`             | Same options as [`trigger()`](/api/trigger)               |

## Examples

```ts
import HapticFeedback, {
  impact,
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";

// Simple — uses default type and intensity
impact();

// Custom intensity
impact("impactHeavy", 0.3); // gentle heavy

// Named export
HapticFeedback.impact(HapticFeedbackTypes.rigid, 1.0);
```

## Type-to-character mapping

The `type` parameter selects the characteristic sharpness of the feedback. The `intensity` parameter controls how strong it feels:

| Type           | Sharpness (iOS) | Character         |
| -------------- | :-------------: | ----------------- |
| `impactLight`  |       0.3       | Soft, diffuse     |
| `impactMedium` |       0.6       | Neutral           |
| `impactHeavy`  |       0.8       | Sharp, heavy      |
| `rigid`        |       1.0       | Crisp, mechanical |
| `soft`         |       0.1       | Very diffuse      |
| `selection`    |       0.3       | Light, tick-like  |
| Other types    |       0.5       | Neutral           |

## Platform notes

- **iOS**: Uses `CHHapticEngine` with precise intensity and sharpness parameters.
- **Android**: Maps to `VibrationEffect.createWaveform` with amplitude scaled from intensity. On API 33+ tagged with `VibrationAttributes.USAGE_TOUCH`.
- **Web**: Delegates to `navigator.vibrate` with a fixed duration (intensity is ignored — the Web Vibration API has no amplitude control).

## vs `trigger()`

Use `impact()` when you need **custom intensity**. Use [`trigger()`](/api/trigger) for the named, opinionated intensity presets built into each type.
