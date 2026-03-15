# triggerPattern()

Play a sequence of `HapticEvent` objects with precise timing.

## Signature

```ts
triggerPattern(
  events: HapticEvent[],
  options?: HapticOptions,
): void
```

## Parameters

| Parameter | Type            | Description                                                      |
| --------- | --------------- | ---------------------------------------------------------------- |
| `events`  | `HapticEvent[]` | Array of timed haptic events                                     |
| `options` | `HapticOptions` | Platform options (see [`trigger()`](/api/trigger#hapticoptions)) |

### HapticEvent

| Field       | Type                          | Required | Description                                   |
| ----------- | ----------------------------- | :------: | --------------------------------------------- |
| `time`      | `number`                      |    ✓     | Offset from pattern start in **milliseconds** |
| `type`      | `'transient' \| 'continuous'` |    —     | Default `'transient'`                         |
| `duration`  | `number`                      |    —     | Duration in ms — only for `continuous` type   |
| `intensity` | `number`                      |    —     | `0.0`–`1.0`                                   |
| `sharpness` | `number`                      |    —     | `0.0`–`1.0`                                   |

## Usage

### With the `pattern()` helper (recommended)

```ts
import HapticFeedback, { pattern } from "react-native-haptic-feedback";

HapticFeedback.triggerPattern(pattern("oO.O"));
```

### With a named preset

```ts
import HapticFeedback, { Patterns } from "react-native-haptic-feedback";

HapticFeedback.triggerPattern(Patterns.success);
```

### With manual events

```ts
HapticFeedback.triggerPattern([
  { time: 0, type: "transient", intensity: 0.5, sharpness: 0.5 },
  { time: 100, type: "transient", intensity: 1.0, sharpness: 0.8 },
  {
    time: 200,
    type: "continuous",
    duration: 300,
    intensity: 0.6,
    sharpness: 0.2,
  },
]);
```

## Platform behaviour

**iOS** — Events are played through `CHHapticEngine`. `transient` events map to haptic transients; `continuous` events map to haptic continuous events with the given duration.

**Android** — Events are converted to a `VibrationEffect.createWaveform` waveform on API 26+. `intensity` is used to scale vibration amplitude. On older devices a simpler vibrate pattern is used.

## See also

- [`pattern()`](/api/pattern) — notation string → `HapticEvent[]`
- [`Patterns`](/api/presets) — built-in presets
- [`playHaptic()`](/api/play-haptic) — cross-platform AHAP/pattern bridge
