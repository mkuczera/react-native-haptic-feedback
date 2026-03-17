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
  dragStart = "dragStart",
  gestureThresholdActivate = "gestureThresholdActivate",
  gestureThresholdDeactivate = "gestureThresholdDeactivate",
  noHaptics = "noHaptics",
}

export interface HapticOptions {
  enableVibrateFallback?: boolean;
  ignoreAndroidSystemSettings?: boolean;
}

/** A single allowed character in a pattern notation string. */
export type PatternChar = "o" | "O" | "." | "-" | "=";

export interface HapticEvent {
  /** Time offset from pattern start in milliseconds */
  time: number;
  type?: "transient" | "continuous";
  /** Duration in milliseconds, for continuous events only */
  duration?: number;
  /** 0.0–1.0 */
  intensity?: number;
  /** 0.0–1.0 */
  sharpness?: number;
}

// ─── AHAP types (iOS only) ────────────────────────────────────────────────────
// These mirror the Apple Haptic and Audio Pattern format used by CHHapticEngine.
// See: https://developer.apple.com/documentation/corehaptics/representing_haptic_patterns_in_ahap_files

/** @platform ios */
export type AhapEventParameterID =
  | "HapticIntensity"
  | "HapticSharpness"
  | "AttackTime"
  | "DecayTime"
  | "ReleaseTime"
  | "Sustained"
  | "AudioVolume"
  | "AudioPitch"
  | "AudioPan"
  | "AudioBrightness";

/** @platform ios */
export type AhapDynamicParameterID =
  | "HapticIntensityControl"
  | "HapticSharpnessControl"
  | "HapticAttackTimeControl"
  | "HapticDecayTimeControl"
  | "HapticReleaseTimeControl"
  | "AudioVolumeControl"
  | "AudioPanControl"
  | "AudioBrightnessControl"
  | "AudioPitchControl"
  | "AudioAttackTimeControl"
  | "AudioDecayTimeControl"
  | "AudioReleaseTimeControl";

/** @platform ios */
export interface AhapEventParameterValue {
  ParameterID: AhapEventParameterID;
  ParameterValue: number;
}

/** @platform ios */
export interface AhapParameterCurveControlPoint {
  Time: number;
  ParameterValue: number;
}

/** A single event entry in an AHAP Pattern array. @platform ios */
export type AhapEventPattern =
  | {
      Event: {
        EventType: "HapticTransient";
        Time: number;
        EventParameters: AhapEventParameterValue[];
      };
    }
  | {
      Event: {
        EventType: "HapticContinuous";
        Time: number;
        EventDuration: number;
        EventParameters: AhapEventParameterValue[];
      };
    }
  | {
      Event: {
        EventType: "AudioCustom";
        Time: number;
        EventWaveformPath: string;
        EventParameters: AhapEventParameterValue[];
      };
    };

/** A parameter curve entry in an AHAP Pattern array. @platform ios */
export interface AhapParameterCurvePattern {
  ParameterCurve: {
    ParameterID: AhapDynamicParameterID;
    Time: number;
    ParameterCurveControlPoints: AhapParameterCurveControlPoint[];
  };
}

/**
 * An Apple Haptic and Audio Pattern (AHAP) object.
 * Can be passed to `playAHAP` as an alternative to a file name (iOS only).
 *
 * @platform ios
 * @see https://developer.apple.com/documentation/corehaptics/representing_haptic_patterns_in_ahap_files
 */
export interface AhapType {
  Version?: 1.0;
  Metadata?: {
    Project?: string;
    Created?: string;
    Description?: string;
  };
  Pattern: (AhapEventPattern | AhapParameterCurvePattern)[];
}

// ─────────────────────────────────────────────────────────────────────────────

export interface SystemHapticStatus {
  /** true if device has vibrator and is not in silent mode */
  vibrationEnabled: boolean;
  /**
   * Android: current ringer mode.
   * iOS: always null — iOS does not expose ringer mode via public APIs.
   */
  ringerMode: "silent" | "vibrate" | "normal" | null;
}

/**
 * Returns true if the ringer is in silent mode.
 * On iOS `ringerMode` is always `null` (not exposed by the OS), so this
 * returns `false` — treat silence as unknown, not as silent.
 *
 * @example
 * const status = await getSystemHapticStatus();
 * if (isRingerSilent(status)) showSilentBadge();
 */
export function isRingerSilent(status: SystemHapticStatus): boolean {
  return status.ringerMode === "silent";
}
