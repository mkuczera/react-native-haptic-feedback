import { Platform } from "react-native";
import RNHapticFeedback from "../hapticFeedback";
import type { HapticEvent, HapticOptions } from "../types";

/**
 * Cross-platform haptic file playback.
 *
 * - **iOS**: plays the given `.ahap` file via Core Haptics (`playAHAP`).
 *   Place `.ahap` files in `<bundle>/haptics/` or the bundle root.
 * - **Android**: AHAP is an Apple-only format. The `fallback` pattern is
 *   played via `triggerPattern` instead.
 *
 * This is the recommended cross-platform alternative to the iOS-only `playAHAP`.
 *
 * @example
 * import { playHaptic, pattern } from 'react-native-haptic-feedback';
 *
 * await playHaptic('my-effect.ahap', pattern('oO.O'));
 */
export async function playHaptic(
  ahapFile: string,
  fallback: HapticEvent[],
  options?: HapticOptions,
): Promise<void> {
  if (!RNHapticFeedback.isEnabled()) return;
  if (Platform.OS === "ios") {
    return RNHapticFeedback.playAHAP(ahapFile);
  }
  return RNHapticFeedback.triggerPattern(fallback, options);
}
