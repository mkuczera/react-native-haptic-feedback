import { NativeModules } from "react-native";
import { HapticFeedbackTypes } from "./types";
import type { HapticOptions } from "./types";

import type { Spec } from "./NativeHapticFeedback";
export * from "./types";

const defaultOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false,
};

class RNReactNativeHapticFeedback {
  static trigger = (
    type: string | HapticFeedbackTypes = HapticFeedbackTypes.selection,
    options: HapticOptions = {},
  ) => {
    const triggerOptions = createTriggerOptions(options);

    try {
      const isTurboModuleEnabled = global.__turboModuleProxy != null;
      const hapticFeedback = isTurboModuleEnabled
        ? (require("./NativeHapticFeedback").default as Spec)
        : NativeModules.RNHapticFeedback;

      hapticFeedback.trigger(type, triggerOptions);
    } catch (err) {
      console.warn("RNReactNativeHapticFeedback is not available");
    }
  };
}

const createTriggerOptions = (options: HapticOptions) => {
  // if options is a boolean we're using an api <=1.6 and we should pass use it to set the enableVibrateFallback option
  if (typeof options === "boolean") {
    return {
      ...defaultOptions,
      enableVibrateFallback: options,
    };
  } else {
    return { ...defaultOptions, ...options };
  }
};

export const trigger = RNReactNativeHapticFeedback.trigger;

export default RNReactNativeHapticFeedback;
