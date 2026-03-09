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
  confirm = "confirm",
  reject = "reject",
  gestureStart = "gestureStart",
  gestureEnd = "gestureEnd",
  segmentTick = "segmentTick",
  segmentFrequentTick = "segmentFrequentTick",
  toggleOn = "toggleOn",
  toggleOff = "toggleOff",
}

export interface HapticOptions {
  enableVibrateFallback?: boolean;
  ignoreAndroidSystemSettings?: boolean;
}

/** A single allowed character in a pattern notation string. */
export type PatternChar = 'o' | 'O' | '.' | '-' | '=';

export interface HapticEvent {
  /** Time offset from pattern start in milliseconds */
  time: number;
  type?: 'transient' | 'continuous';
  /** Duration in milliseconds, for continuous events only */
  duration?: number;
  /** 0.0–1.0 */
  intensity?: number;
  /** 0.0–1.0 */
  sharpness?: number;
}

export interface SystemHapticStatus {
  /** true if device has vibrator and is not in silent mode */
  vibrationEnabled: boolean;
  ringerMode: 'silent' | 'vibrate' | 'normal';
}
