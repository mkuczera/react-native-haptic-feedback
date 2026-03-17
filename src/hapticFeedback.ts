import NativeHapticFeedback from "./codegenSpec/NativeHapticFeedback";
import { HapticFeedbackTypes } from "./types";
import type { HapticOptions, HapticEvent, SystemHapticStatus } from "./types";

// Characteristic sharpness per impact type for use with impact()
const IMPACT_SHARPNESS: Partial<Record<string, number>> = {
  [HapticFeedbackTypes.impactLight]: 0.3,
  [HapticFeedbackTypes.impactMedium]: 0.6,
  [HapticFeedbackTypes.impactHeavy]: 0.8,
  [HapticFeedbackTypes.rigid]: 1.0,
  [HapticFeedbackTypes.soft]: 0.1,
  [HapticFeedbackTypes.selection]: 0.3,
};

const defaultOptions: Required<HapticOptions> = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false,
};

let _enabled = true;

const RNHapticFeedback = {
  /**
   * Enable or disable all haptic feedback library-wide.
   * Useful for respecting a user's in-app haptics preference.
   * The setting is in-memory only — persist it yourself if needed across sessions.
   */
  setEnabled(value: boolean): void {
    _enabled = value;
  },

  /** Returns whether haptic feedback is currently enabled. */
  isEnabled(): boolean {
    return _enabled;
  },

  trigger(
    type:
      | keyof typeof HapticFeedbackTypes
      | HapticFeedbackTypes = HapticFeedbackTypes.selection,
    options: HapticOptions = {},
  ): void {
    if (!_enabled) return;
    try {
      NativeHapticFeedback.trigger(type, { ...defaultOptions, ...options });
    } catch (e) {
      console.warn("RNReactNativeHapticFeedback: trigger failed –", e);
    }
  },

  stop(): void {
    if (!_enabled) return;
    try {
      NativeHapticFeedback.stop();
    } catch (e) {
      console.warn("RNReactNativeHapticFeedback: stop failed –", e);
    }
  },

  isSupported(): boolean {
    try {
      return NativeHapticFeedback.isSupported();
    } catch {
      return false;
    }
  },

  triggerPattern(events: HapticEvent[], options: HapticOptions = {}): void {
    if (!_enabled) return;
    try {
      NativeHapticFeedback.triggerPattern(events, {
        ...defaultOptions,
        ...options,
      });
    } catch (e) {
      console.warn("RNReactNativeHapticFeedback: triggerPattern failed –", e);
    }
  },

  /**
   * Play an Apple Haptic and Audio Pattern (AHAP) file by name.
   *
   * Place `.ahap` files in `<bundle>/haptics/` or the bundle root.
   * Resolves immediately on Android (AHAP is an Apple-only format).
   *
   * For cross-platform usage, prefer `playHaptic(ahapFile, fallback)`.
   *
   * @platform ios
   */
  playAHAP(fileName: string): Promise<void> {
    if (!_enabled) return Promise.resolve();
    try {
      return NativeHapticFeedback.playAHAP(fileName);
    } catch {
      return Promise.resolve();
    }
  },

  /**
   * Play a haptic with a custom intensity (0.0–1.0).
   *
   * On iOS (Core Haptics), the intensity is applied precisely via CHHapticEngine.
   * On Android it maps to `VibrationEffect` amplitude.
   * On devices without haptic hardware this is a no-op.
   *
   * @param type - haptic type that determines the base sharpness/character (default `impactMedium`)
   * @param intensity - 0.0 (silent) to 1.0 (maximum), default 0.7
   * @param options - same options as `trigger()`
   */
  impact(
    type:
      | keyof typeof HapticFeedbackTypes
      | HapticFeedbackTypes = HapticFeedbackTypes.impactMedium,
    intensity = 0.7,
    options: HapticOptions = {},
  ): void {
    if (!_enabled) return;
    const sharpness = IMPACT_SHARPNESS[type as string] ?? 0.5;
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    try {
      NativeHapticFeedback.triggerPattern(
        [{ time: 0, intensity: clampedIntensity, sharpness }],
        { ...defaultOptions, ...options },
      );
    } catch (e) {
      console.warn("RNReactNativeHapticFeedback: impact failed –", e);
    }
  },

  async getSystemHapticStatus(): Promise<SystemHapticStatus> {
    try {
      return (await NativeHapticFeedback.getSystemHapticStatus()) as SystemHapticStatus;
    } catch {
      return { vibrationEnabled: false, ringerMode: null };
    }
  },
};

export default RNHapticFeedback;
