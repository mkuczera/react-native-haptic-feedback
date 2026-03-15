# Patterns presets

Six pre-built `HapticEvent[]` arrays for common haptic sequences. All presets are computed once at import time — no runtime cost per call.

## Import

```ts
import { Patterns } from "react-native-haptic-feedback";
import type { PatternName } from "react-native-haptic-feedback";
```

## Preset reference

| Name           | Notation | Description                                |
| -------------- | :------: | ------------------------------------------ |
| `success`      |  `oO.O`  | Soft then strong — "good job" feel         |
| `error`        | `OO.OO`  | Two heavy double-hits — clear error signal |
| `warning`      |  `O.O`   | Single medium pulse — gentle alert         |
| `heartbeat`    | `oO--oO` | Double heartbeat rhythm                    |
| `tripleClick`  | `o.o.o`  | Rapid triple tap                           |
| `notification` | `o-O=o`  | Rise-and-fall — incoming message           |

## Usage

```ts
import HapticFeedback, { Patterns } from "react-native-haptic-feedback";

HapticFeedback.triggerPattern(Patterns.success);
HapticFeedback.triggerPattern(Patterns.error);
```

### With `useHaptics`

```ts
const haptics = useHaptics();

haptics.triggerPattern(Patterns.heartbeat);
```

### As a cross-platform fallback

```ts
import { playHaptic, Patterns } from "react-native-haptic-feedback";

await playHaptic("success.ahap", Patterns.success);
```

### Dynamic preset lookup

```ts
import { Patterns } from "react-native-haptic-feedback";
import type { PatternName } from "react-native-haptic-feedback";

function playPreset(name: PatternName) {
  HapticFeedback.triggerPattern(Patterns[name]);
}

playPreset("heartbeat");
```

## PatternName type

```ts
type PatternName =
  | "success"
  | "error"
  | "warning"
  | "heartbeat"
  | "tripleClick"
  | "notification";
```

## See also

- [`pattern()`](/api/pattern) — create your own patterns
- [`triggerPattern()`](/api/trigger-pattern)
- [Pattern notation guide](/guide/pattern)
