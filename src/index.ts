import RNHapticFeedback from "./hapticFeedback";
import { pattern } from "./utils/pattern";

export { useHaptics } from "./hooks/useHaptics";
export { Patterns } from "./presets";
export type { PatternName } from "./presets";
export * from "./types";
export { pattern };
export { PATTERN_CHARS } from "./utils/pattern";
export type { AssertValidPattern } from "./utils/pattern";
export { playHaptic } from "./utils/playHaptic";
export { TouchableHaptic } from "./components/TouchableHaptic";
export type { TouchableHapticProps } from "./components/TouchableHaptic";
export const {
  trigger,
  stop,
  isSupported,
  triggerPattern,
  getSystemHapticStatus,
  setEnabled,
  isEnabled,
} = RNHapticFeedback;
/** @platform ios */
export const { playAHAP } = RNHapticFeedback;
export default RNHapticFeedback;
