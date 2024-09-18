import NativeHapticFeedback from './codegenSpec/NativeHapticFeedback';
import { HapticFeedbackTypes } from "./types";
import type { HapticOptions } from "./types";

const defaultOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false,
};

const RNHapticFeedback = {
  trigger(
    type:
      | keyof typeof HapticFeedbackTypes
      | HapticFeedbackTypes = HapticFeedbackTypes.selection,
    options: HapticOptions = {},
  ) {
    try {
      NativeHapticFeedback.trigger(type, { ...defaultOptions, ...options });
    } catch {
      console.warn("RNReactNativeHapticFeedback is not available");
    }
  }
}

export * from "./types";
export const { trigger } = RNHapticFeedback;
export default RNHapticFeedback;
