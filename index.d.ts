declare const ReactNativeHapticFeedback: {
  trigger(
    type:
      | "selection"
      | "impactLight"
      | "impactMedium"
      | "impactHeavy"
      | "notificationSuccess"
      | "notificationWarning"
      | "notificationError",
    enableVibrateFallback: boolean
  ): void;
};

export default ReactNativeHapticFeedback;