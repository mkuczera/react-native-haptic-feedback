export enum HapticFeedbackTypes {
  selection = "selection",
  impactLight = "impactLight",
  impactMedium = "impactMedium",
  impactHeavy = "impactHeavy",
  rigid = "rigid",
  soft = "soft",
  notificationSuccess = "notificationSuccess",
  notificationWarning = "notificationWarning",
  notificationError = "notificationError",
  clockTick = "clockTick",
  contextClick = "contextClick",
  keyboardPress = "keyboardPress",
  keyboardRelease = "keyboardRelease",
  keyboardTap = "keyboardTap",
  longPress = "longPress",
  textHandleMove = "textHandleMove",
  virtualKey = "virtualKey",
  virtualKeyRelease = "virtualKeyRelease",
  effectClick = "effectClick",
  effectDoubleClick = "effectDoubleClick",
  effectHeavyClick = "effectHeavyClick",
  effectTick = "effectTick",
}

export interface HapticOptions {
  enableVibrateFallback?: boolean;
  ignoreAndroidSystemSettings?: boolean;
}
