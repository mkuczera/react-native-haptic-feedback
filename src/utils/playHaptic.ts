import { Platform } from 'react-native';
import RNHapticFeedback from '../hapticFeedback';
import type { HapticEvent, HapticOptions } from '../types';

/**
 * Cross-platform haptic file playback.
 *
 * - iOS: plays the given `.ahap` file via `playAHAP`.
 * - Android: plays `fallback` via `triggerPattern` (AHAP is an Apple format).
 *
 * Place `.ahap` files in `<bundle>/haptics/` or the bundle root.
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
  if (Platform.OS === 'ios') {
    return RNHapticFeedback.playAHAP(ahapFile);
  }
  RNHapticFeedback.triggerPattern(fallback, options);
}
