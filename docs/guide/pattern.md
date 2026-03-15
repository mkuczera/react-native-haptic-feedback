# Pattern Notation

The `pattern()` helper converts a compact notation string into a `HapticEvent[]` array that can be passed to `triggerPattern()` or used as a fallback in `playHaptic()`.

## Character reference

| Char | Meaning          | Effect                                              |
| :--: | ---------------- | --------------------------------------------------- |
| `o`  | Soft transient   | Intensity 0.4, sharpness 0.4; advances cursor 50 ms |
| `O`  | Strong transient | Intensity 1.0, sharpness 0.8; advances cursor 50 ms |
| `.`  | Short gap        | +100 ms                                             |
| `-`  | Medium gap       | +300 ms                                             |
| `=`  | Long gap         | +1000 ms                                            |

Gap characters add to the current cursor position. Consecutive haptic events (`OOO`) are implicitly 50 ms apart so the hardware renders each as a distinct pulse.

## Examples

```ts
import { pattern } from "react-native-haptic-feedback";

pattern("oO"); // two pulses: soft then strong
pattern("O.O"); // two strong pulses, 100 ms apart
pattern("oO--oO"); // heartbeat: double-pulse, pause, double-pulse
pattern("o.o.o"); // rapid triple tap
```

## Visualizing timing

```
notation  →  o    O    .    O
cursor    →  0   50  150  250  (ms)
```

| Notation | Events | Total duration |
| -------- | :----: | -------------: |
| `oO`     |   2    |        ~100 ms |
| `O.O`    |   2    |        ~250 ms |
| `oO--oO` |   4    |        ~750 ms |
| `o.o.o`  |   3    |        ~350 ms |
| `o-O=o`  |   3    |      ~1 450 ms |

## Compile-time validation

When you pass a **string literal**, TypeScript rejects invalid characters at compile time:

```ts
pattern("oO.O"); // ✓ valid
pattern("oXO"); // ✗ TypeScript error: Argument of type 'string' is not assignable
//   to parameter of type 'never'
```

Runtime variables are allowed through without type errors; invalid characters throw a `TypeError` at runtime instead:

```ts
const s: string = getUserInput();
pattern(s); // compiles fine; throws TypeError if s contains bad chars
```

## Runtime validation

```ts
try {
  const events = pattern(userInput);
  HapticFeedback.triggerPattern(events);
} catch (e) {
  if (e instanceof TypeError) {
    console.warn(e.message);
    // "pattern(): invalid character "x" at position 2. Allowed characters are: o O . - ="
  }
}
```

## Built-in presets

Six named presets are available as pre-computed `HapticEvent[]` arrays:

```ts
import { Patterns } from "react-native-haptic-feedback";

HapticFeedback.triggerPattern(Patterns.success);
HapticFeedback.triggerPattern(Patterns.error);
```

| Name           | Notation | Description                         |
| -------------- | :------: | ----------------------------------- |
| `success`      |  `oO.O`  | Soft then strong — "good job" feel  |
| `error`        | `OO.OO`  | Two heavy hits — clear error signal |
| `warning`      |  `O.O`   | Single medium pulse — gentle alert  |
| `heartbeat`    | `oO--oO` | Double heartbeat rhythm             |
| `tripleClick`  | `o.o.o`  | Rapid triple tap                    |
| `notification` | `o-O=o`  | Long rise-and-fall                  |

See the full [Patterns API reference](/api/presets).
