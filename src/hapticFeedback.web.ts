/**
 * Web platform implementation of react-native-haptic-feedback.
 * Uses the Web Vibration API (navigator.vibrate) where supported.
 * Silently no-ops on browsers that don't support vibration.
 */

import { HapticFeedbackTypes } from "./types";
import type { HapticOptions, HapticEvent, SystemHapticStatus } from "./types";

// Duration map for single-pulse haptics (milliseconds)
const WEB_DURATION: Partial<Record<string, number | number[]>> = {
  [HapticFeedbackTypes.impactLight]: 20,
  [HapticFeedbackTypes.impactMedium]: 40,
  [HapticFeedbackTypes.impactHeavy]: 60,
  [HapticFeedbackTypes.rigid]: 50,
  [HapticFeedbackTypes.soft]: 15,
  [HapticFeedbackTypes.selection]: 15,
  [HapticFeedbackTypes.notificationSuccess]: [30, 40, 20],
  [HapticFeedbackTypes.notificationWarning]: [20, 40, 30],
  [HapticFeedbackTypes.notificationError]: [20, 30, 30, 30, 40],
  [HapticFeedbackTypes.effectClick]: 20,
  [HapticFeedbackTypes.effectDoubleClick]: [20, 40, 20],
  [HapticFeedbackTypes.effectHeavyClick]: 50,
  [HapticFeedbackTypes.effectTick]: 15,
  [HapticFeedbackTypes.clockTick]: 15,
  [HapticFeedbackTypes.contextClick]: 20,
  [HapticFeedbackTypes.keyboardPress]: 20,
  [HapticFeedbackTypes.keyboardRelease]: 10,
  [HapticFeedbackTypes.keyboardTap]: 20,
  [HapticFeedbackTypes.longPress]: 40,
  [HapticFeedbackTypes.textHandleMove]: 10,
  [HapticFeedbackTypes.virtualKey]: 20,
  [HapticFeedbackTypes.virtualKeyRelease]: 10,
  [HapticFeedbackTypes.confirm]: [30, 40, 20],
  [HapticFeedbackTypes.reject]: [50, 40, 30],
  [HapticFeedbackTypes.gestureStart]: 15,
  [HapticFeedbackTypes.gestureEnd]: 20,
  [HapticFeedbackTypes.segmentTick]: 10,
  [HapticFeedbackTypes.segmentFrequentTick]: 8,
  [HapticFeedbackTypes.toggleOn]: [15, 30, 25],
  [HapticFeedbackTypes.toggleOff]: [25, 30, 15],
  [HapticFeedbackTypes.dragStart]: 15,
  [HapticFeedbackTypes.gestureThresholdActivate]: 20,
  [HapticFeedbackTypes.gestureThresholdDeactivate]: 10,
  // noHaptics: intentionally absent — no vibration
};

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

let _enabled = true;

const RNHapticFeedback = {
  setEnabled(value: boolean): void {
    _enabled = value;
  },

  isEnabled(): boolean {
    return _enabled;
  },

  trigger(
    type:
      | keyof typeof HapticFeedbackTypes
      | HapticFeedbackTypes = HapticFeedbackTypes.selection,
    _options: HapticOptions = {},
  ): void {
    if (!_enabled) return;
    const pattern = WEB_DURATION[type as string] ?? 40;
    vibrate(pattern);
  },

  stop(): void {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(0);
    }
  },

  isSupported(): boolean {
    return typeof navigator !== "undefined" && "vibrate" in navigator;
  },

  triggerPattern(events: HapticEvent[], _options: HapticOptions = {}): void {
    if (!_enabled) return;
    if (!events.length) return;

    const sorted = [...events].sort((a, b) => a.time - b.time);
    const pattern: number[] = [];
    let prevEnd = 0;
    for (const evt of sorted) {
      const gap = Math.max(0, evt.time - prevEnd);
      const duration = evt.duration ?? 50;
      pattern.push(gap, duration);
      prevEnd = evt.time + duration;
    }
    vibrate(pattern);
  },

  impact(
    type:
      | keyof typeof HapticFeedbackTypes
      | HapticFeedbackTypes = HapticFeedbackTypes.impactMedium,
    intensity = 0.7,
    _options: HapticOptions = {},
  ): void {
    if (!_enabled) return;
    const base = WEB_DURATION[type as string] ?? 40;
    const clamped = Math.max(0, Math.min(1, intensity));
    const pattern = Array.isArray(base)
      ? base.map((d) => Math.round(d * clamped))
      : Math.round(base * clamped);
    vibrate(pattern);
  },

  playAHAP(_fileName: string): Promise<void> {
    return Promise.resolve();
  },

  async getSystemHapticStatus(): Promise<SystemHapticStatus> {
    const supported =
      typeof navigator !== "undefined" && "vibrate" in navigator;
    return { vibrationEnabled: supported, ringerMode: null };
  },
};

export default RNHapticFeedback;
