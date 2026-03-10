import { useMemo } from "react";
import RNHapticFeedback from "../hapticFeedback";
import type { HapticOptions, HapticEvent, HapticFeedbackTypes } from "../types";

/**
 * React hook that provides haptic feedback methods with optional default options.
 * Returns a stable object — methods only change when the option values change.
 *
 * @example
 * const haptics = useHaptics({ enableVibrateFallback: true });
 * haptics.trigger('impactMedium');
 */
export function useHaptics(defaultOptions?: HapticOptions) {
  const enableVibrateFallback = defaultOptions?.enableVibrateFallback;
  const ignoreAndroidSystemSettings = defaultOptions?.ignoreAndroidSystemSettings;

  return useMemo(() => ({
    trigger(
      type: keyof typeof HapticFeedbackTypes | HapticFeedbackTypes,
      opts?: HapticOptions,
    ): void {
      RNHapticFeedback.trigger(type, { ...defaultOptions, ...opts });
    },

    triggerPattern(events: HapticEvent[], opts?: HapticOptions): void {
      RNHapticFeedback.triggerPattern(events, { ...defaultOptions, ...opts });
    },

    stop(): void {
      RNHapticFeedback.stop();
    },

    isSupported(): boolean {
      return RNHapticFeedback.isSupported();
    },

    setEnabled: RNHapticFeedback.setEnabled,
    isEnabled: RNHapticFeedback.isEnabled,
    getSystemHapticStatus: RNHapticFeedback.getSystemHapticStatus,
    /** @platform ios */
    playAHAP: RNHapticFeedback.playAHAP,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [enableVibrateFallback, ignoreAndroidSystemSettings]);
}
