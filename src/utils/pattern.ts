import type { HapticEvent, PatternChar } from "../types";

/** Set of characters that are valid in a pattern notation string. */
export const PATTERN_CHARS: ReadonlySet<PatternChar> = new Set([
  "o",
  "O",
  ".",
  "-",
  "=",
]);

/**
 * Recursively validates that every character in a string literal type is a `PatternChar`.
 * Resolves to `true` for valid strings and `false` for strings containing invalid chars.
 */
type IsValidPattern<S extends string> = S extends ""
  ? true
  : S extends `${PatternChar}${infer Rest}`
  ? IsValidPattern<Rest>
  : false;

/**
 * Use as a constraint on the `pattern()` argument to get compile-time errors for
 * string literals that contain invalid characters.
 *
 * - Widened `string` (runtime variable) → passes through unchanged (runtime validates)
 * - String literal with valid chars only → passes through unchanged
 * - String literal with an invalid char → resolves to `never`, causing a type error
 *
 * @example
 * type A = AssertValidPattern<'oO.O'>;   // 'oO.O'   ✓
 * type B = AssertValidPattern<'oXO'>;    // never    ✗ compile error
 * type C = AssertValidPattern<string>;   // string   ✓ (runtime validates)
 */
export type AssertValidPattern<S extends string> = string extends S
  ? S
  : IsValidPattern<S> extends true
  ? S
  : never;

/**
 * Minimum time advance (ms) after a transient haptic event. The Taptic Engine
 * on iOS cannot physically distinguish transient events closer than ~80-100 ms.
 * Apple's own Core Haptics patterns use 100 ms as the minimum spacing for
 * perceptibly distinct events. Android vibrators have a similar floor.
 */
const TRANSIENT_DURATION_MS = 100;

/**
 * Convert a pattern notation string into an array of HapticEvents.
 *
 * Allowed characters:
 *  o  — soft transient   (intensity 0.4, sharpness 0.4)
 *  O  — strong transient (intensity 1.0, sharpness 0.8)
 *  .  — 150 ms gap  (total O.O = 250 ms)
 *  -  — 400 ms gap  (total O-O = 500 ms)
 *  =  — 1000 ms gap (total O=O = 1100 ms)
 *
 * Consecutive haptic events (e.g. `OOO`) are spaced 100 ms apart so the
 * hardware can render each as a distinct pulse. To add extra spacing between
 * events, insert gap characters (`.`, `-`, `=`).
 *
 * Throws a `TypeError` at runtime if the string contains any character outside this set.
 * Produces a **compile-time error** when a string literal contains invalid characters.
 *
 * @example
 * pattern('oO.O');   // ✓
 * pattern('oXO');    // ✗ TypeScript error: Argument of type 'string' is not assignable to parameter of type 'never'
 */
export function pattern<S extends string>(
  notation: S & AssertValidPattern<S>,
): HapticEvent[] {
  // Runtime validation
  let pos = 0;
  for (const ch of notation) {
    if (!PATTERN_CHARS.has(ch as PatternChar)) {
      throw new TypeError(
        `pattern(): invalid character "${ch}" at position ${pos}. ` +
          `Allowed characters are: o O . - =`,
      );
    }
    pos++;
  }

  const events: HapticEvent[] = [];
  let cursor = 0; // running time in ms

  for (const ch of notation) {
    switch (ch) {
      case "o":
        events.push({
          time: cursor,
          type: "transient",
          intensity: 0.4,
          sharpness: 0.4,
        });
        cursor += TRANSIENT_DURATION_MS;
        break;
      case "O":
        events.push({
          time: cursor,
          type: "transient",
          intensity: 1.0,
          sharpness: 0.8,
        });
        cursor += TRANSIENT_DURATION_MS;
        break;
      case ".":
        cursor += 150;
        break;
      case "-":
        cursor += 400;
        break;
      case "=":
        cursor += 1000;
        break;
    }
  }

  return events;
}
