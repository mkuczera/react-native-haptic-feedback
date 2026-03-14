/**
 * Official Jest auto-mock for react-native-haptic-feedback.
 *
 * Usage in tests:
 *   jest.mock('react-native-haptic-feedback');
 */

import { pattern as realPattern } from "../utils/pattern";
import { playHaptic as realPlayHaptic } from "../utils/playHaptic";
import { Patterns as realPatterns } from "../presets";

export const trigger = jest.fn();
export const stop = jest.fn();
export const isSupported = jest.fn().mockReturnValue(true);
export const triggerPattern = jest.fn();
export const playAHAP = jest.fn().mockResolvedValue(undefined);
export const getSystemHapticStatus = jest
  .fn()
  .mockResolvedValue({ vibrationEnabled: true, ringerMode: "normal" });
export const setEnabled = jest.fn();
export const isEnabled = jest.fn().mockReturnValue(true);
export const pattern = jest.fn().mockImplementation(realPattern);
export const playHaptic = jest.fn().mockImplementation(realPlayHaptic);
export const useHaptics = jest.fn().mockReturnValue({
  trigger,
  triggerPattern,
  stop,
  isSupported,
  setEnabled,
  isEnabled,
  getSystemHapticStatus,
  playAHAP,
  playHaptic,
});
export const Patterns = realPatterns;

const RNHapticFeedback = {
  trigger,
  stop,
  isSupported,
  triggerPattern,
  playAHAP,
  getSystemHapticStatus,
  setEnabled,
  isEnabled,
};

export default RNHapticFeedback;
