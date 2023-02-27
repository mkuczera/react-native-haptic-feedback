declare module "react-native-haptic-feedback" {
  namespace ReactNativeHapticFeedback {
    export type HapticFeedbackTypes =
      | "selection"
      | "impactLight"
      | "impactMedium"
      | "impactHeavy"
      | "rigid"
      | "soft"
      | "notificationSuccess"
      | "notificationWarning"
      | "notificationError"
      | "clockTick"
      | "contextClick"
      | "keyboardPress"
      | "keyboardRelease"
      | "keyboardTap"
      | "longPress"
      | "textHandleMove"
      | "virtualKey"
      | "virtualKeyRelease"
      | "effectClick"
      | "effectDoubleClick"
      | "effectHeavyClick"
      | "effectTick";

    export interface HapticOptions {
      enableVibrateFallback?: boolean;
      ignoreAndroidSystemSettings?: boolean;
    }
  }

  class ReactNativeHapticFeedback {
    static trigger(
      type: ReactNativeHapticFeedback.HapticFeedbackTypes,
      options?: ReactNativeHapticFeedback.HapticOptions
    ): void;
  }

  export = ReactNativeHapticFeedback;
}
