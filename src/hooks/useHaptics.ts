import RNHapticFeedback from "../hapticFeedback";
import type { HapticOptions, HapticEvent, HapticFeedbackTypes } from "../types";

/**
 * React hook that provides haptic feedback methods with optional default options.
 *
 * @example
 * const haptics = useHaptics({ enableVibrateFallback: true });
 * haptics.trigger('impactMedium');
 */
export function useHaptics(defaultOptions?: HapticOptions) {
  return {
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
  };
}
