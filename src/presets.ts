import { pattern } from "./utils/pattern";
import type { HapticEvent } from "./types";

/** Union of all built-in preset names. */
export type PatternName =
  | "success"
  | "error"
  | "warning"
  | "heartbeat"
  | "tripleClick"
  | "notification";

/**
 * Named pattern presets for common haptic sequences.
 * Use with `RNHapticFeedback.triggerPattern(Patterns.success)`.
 */
export const Patterns: Record<PatternName, HapticEvent[]> = {
  /** Soft then strong — "good job" feel */
  success: pattern("oO.O"),

  /** Two heavy hits — clear error signal */
  error: pattern("OO.OO"),

  /** Single medium pulse — gentle alert */
  warning: pattern("O.O"),

  /** Double heartbeat rhythm */
  heartbeat: pattern("oO--oO"),

  /** Rapid triple tap */
  tripleClick: pattern("o.o.o"),

  /** Long rise-and-fall */
  notification: pattern("o-O=o"),
};
