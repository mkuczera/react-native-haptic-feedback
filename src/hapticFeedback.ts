import NativeHapticFeedback from './codegenSpec/NativeHapticFeedback';
import { HapticFeedbackTypes } from "./types";
import type { HapticOptions, HapticEvent, SystemHapticStatus } from "./types";

const defaultOptions: Required<HapticOptions> = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false,
};

const RNHapticFeedback = {
  trigger(
    type:
      | keyof typeof HapticFeedbackTypes
      | HapticFeedbackTypes = HapticFeedbackTypes.selection,
    options: HapticOptions = {},
  ): void {
    try {
      NativeHapticFeedback.trigger(type, { ...defaultOptions, ...options });
    } catch {
      console.warn("RNReactNativeHapticFeedback is not available");
    }
  },

  stop(): void {
    try {
      NativeHapticFeedback.stop();
    } catch {
      console.warn("RNReactNativeHapticFeedback is not available");
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
    try {
      NativeHapticFeedback.triggerPattern(events, { ...defaultOptions, ...options });
    } catch {
      console.warn("RNReactNativeHapticFeedback is not available");
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
    try {
      return NativeHapticFeedback.playAHAP(fileName);
    } catch {
      return Promise.resolve();
    }
  },

  async getSystemHapticStatus(): Promise<SystemHapticStatus> {
    try {
      return await NativeHapticFeedback.getSystemHapticStatus() as SystemHapticStatus;
    } catch {
      return { vibrationEnabled: false, ringerMode: null };
    }
  },
};

export default RNHapticFeedback;
