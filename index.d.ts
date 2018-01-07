declare const ReactNativeHapticFeedback: {
  trigger(
    type:
      | "selection"
      | "impactLight"
      | "impactMedium"
      | "impactHeavy"
      | "notificationSuccess"
      | "notificationWarning"
      | "notificationError"
  ): void;
};

export default ReactNativeHapticFeedback;