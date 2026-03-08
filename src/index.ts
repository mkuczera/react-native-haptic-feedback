import RNHapticFeedback from './hapticFeedback';
import { pattern } from "./utils/pattern";

export { useHaptics } from "./hooks/useHaptics";
export { Patterns } from "./presets";
export * from "./types";
export { pattern };
export const { trigger, stop, isSupported, triggerPattern, playAHAP, getSystemHapticStatus } = RNHapticFeedback;
export default RNHapticFeedback;
