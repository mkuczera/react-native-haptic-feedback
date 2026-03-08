import type { HapticEvent } from "../types";

/**
 * Convert a pattern notation string into an array of HapticEvents.
 *
 * Characters:
 *  o  — soft transient (intensity 0.4, sharpness 0.4)
 *  O  — strong transient (intensity 1.0, sharpness 0.8)
 *  .  — 100 ms gap
 *  -  — 300 ms gap
 *  =  — 1000 ms gap
 *
 * Example:  pattern('oO.O')  →  soft, strong, 100ms, strong
 */
export function pattern(notation: string): HapticEvent[] {
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
      default:
        // unknown characters are silently ignored
        break;
    }
  }

  return events;
}
