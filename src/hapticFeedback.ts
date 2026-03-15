import NativeHapticFeedback from "./codegenSpec/NativeHapticFeedback";
import { HapticFeedbackTypes } from "./types";
import type { HapticOptions, HapticEvent, SystemHapticStatus } from "./types";

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

  async getSystemHapticStatus(): Promise<SystemHapticStatus> {
    try {
      return (await NativeHapticFeedback.getSystemHapticStatus()) as SystemHapticStatus;
    } catch {
      return { vibrationEnabled: false, ringerMode: null };
    }
  },
};

export default RNHapticFeedback;
