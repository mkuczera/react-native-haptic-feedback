import type { HapticEvent, PatternChar } from "../types";

/** Set of characters that are valid in a pattern notation string. */
export const PATTERN_CHARS: ReadonlySet<PatternChar> = new Set(['o', 'O', '.', '-', '=']);

/**
 * Convert a pattern notation string into an array of HapticEvents.
 *
 * Allowed characters:
 *  o  — soft transient   (intensity 0.4, sharpness 0.4)
 *  O  — strong transient (intensity 1.0, sharpness 0.8)
 *  .  — 100 ms gap
 *  -  — 300 ms gap
 *  =  — 1000 ms gap
 *
 * Throws a `TypeError` if the string contains any character outside this set.
 *
 * Example:  pattern('oO.O')  →  soft, strong, 100ms, strong
 */
export function pattern(notation: string): HapticEvent[] {
  // Runtime validation
  for (const ch of notation) {
    if (!PATTERN_CHARS.has(ch as PatternChar)) {
      throw new TypeError(
        `pattern(): invalid character "${ch}" at position ${[...notation].indexOf(ch)}. ` +
        `Allowed characters are: o O . - =`,
      );
    }
  }

  const events: HapticEvent[] = [];
  let cursor = 0; // running time in ms

  for (const ch of notation) {
    switch (ch) {
      case 'o':
        events.push({ time: cursor, type: 'transient', intensity: 0.4, sharpness: 0.4 });
        break;
      case 'O':
        events.push({ time: cursor, type: 'transient', intensity: 1.0, sharpness: 0.8 });
        break;
      case '.':
        cursor += 100;
        break;
      case '-':
        cursor += 300;
        break;
      case '=':
        cursor += 1000;
        break;
    }
  }

  return events;
}
