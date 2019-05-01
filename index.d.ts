declare module "react-native-haptic-feedback" {
  type Feedback =
    | "selection"
    | "impactLight"
    | "impactMedium"
    | "impactHeavy"
    | "notificationSuccess"
    | "notificationWarning"
    | "notificationError";

  interface Options {
    enableVibrateFallback?: boolean;
    ignoreAndroidSystemSettings?: boolean;
  }

  function trigger(type: Feedback, options: Options): void;
}
