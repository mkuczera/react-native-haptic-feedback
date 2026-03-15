# pattern()

Convert a compact notation string into a `HapticEvent[]` array.

## Signature

```ts
function pattern<S extends string>(
  notation: S & AssertValidPattern<S>,
): HapticEvent[];
```

## Parameters

| Parameter  | Type     | Description                    |
| ---------- | -------- | ------------------------------ |
| `notation` | `string` | A string of pattern characters |

## Character reference

| Char | Name             | Haptic                       | Cursor advance |
| :--: | ---------------- | ---------------------------- | -------------: |
| `o`  | Soft transient   | intensity 0.4, sharpness 0.4 |         +50 ms |
| `O`  | Strong transient | intensity 1.0, sharpness 0.8 |         +50 ms |
| `.`  | Short gap        | —                            |        +100 ms |
| `-`  | Medium gap       | —                            |        +300 ms |
| `=`  | Long gap         | —                            |       +1000 ms |

## Returns

An array of `HapticEvent` objects with `time`, `type`, `intensity`, and `sharpness` fields set.

## Usage

```ts
import HapticFeedback, { pattern } from "react-native-haptic-feedback";

const events = pattern("oO.O");
// [
//   { time: 0,   type: 'transient', intensity: 0.4, sharpness: 0.4 },
//   { time: 50,  type: 'transient', intensity: 1.0, sharpness: 0.8 },
//   { time: 200, type: 'transient', intensity: 1.0, sharpness: 0.8 },
// ]

HapticFeedback.triggerPattern(events);
```

## Compile-time validation

String literals are validated at compile time via the `AssertValidPattern<S>` type:

```ts
pattern("oO.O"); // ✓
pattern("oXO"); // ✗ TypeScript error — 'X' is not a valid PatternChar
```

Runtime variables (type `string`) pass the type check and are validated at runtime instead.

## Runtime validation

```ts
try {
  HapticFeedback.triggerPattern(pattern(userInput));
} catch (e) {
  if (e instanceof TypeError) {
    // "pattern(): invalid character "x" at position 2.
    //  Allowed characters are: o O . - ="
  }
}
```

## PATTERN_CHARS

The set of valid characters is exported for use in your own validation:

```ts
import { PATTERN_CHARS } from "react-native-haptic-feedback";

PATTERN_CHARS; // ReadonlySet<PatternChar> → Set { 'o', 'O', '.', '-', '=' }

const valid = [...str].every((ch) => PATTERN_CHARS.has(ch as any));
```

## AssertValidPattern

A utility type that resolves to the input type for valid strings and `never` for strings containing invalid characters:

```ts
import type { AssertValidPattern } from "react-native-haptic-feedback";

type A = AssertValidPattern<"oO.O">; // 'oO.O'   — valid
type B = AssertValidPattern<"oXO">; // never    — invalid
type C = AssertValidPattern<string>; // string   — runtime variable, passes through
```

## See also

- [Pattern notation guide](/guide/pattern)
- [`Patterns` presets](/api/presets)
- [`triggerPattern()`](/api/trigger-pattern)
