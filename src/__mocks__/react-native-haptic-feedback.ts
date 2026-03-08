/**
 * Official Jest auto-mock for react-native-haptic-feedback.
 *
 * Usage in tests:
 *   jest.mock('react-native-haptic-feedback');
 */

export const trigger = jest.fn();
export const stop = jest.fn();
export const isSupported = jest.fn().mockReturnValue(true);
export const triggerPattern = jest.fn();
export const playAHAP = jest.fn().mockResolvedValue(undefined);
export const getSystemHapticStatus = jest
  .fn()
  .mockResolvedValue({ vibrationEnabled: true, ringerMode: 'normal' });
export const useHaptics = jest.fn().mockReturnValue({
  trigger,
  triggerPattern,
  stop,
  isSupported,
});
export const pattern = jest.fn().mockImplementation((notation: string) => {
  // Lightweight real implementation so callers get the right shape
  const events: Array<{ time: number; type: string; intensity: number; sharpness: number }> = [];
  let cursor = 0;
  for (const ch of notation) {
    if (ch === 'o') events.push({ time: cursor, type: 'transient', intensity: 0.4, sharpness: 0.4 });
    else if (ch === 'O') events.push({ time: cursor, type: 'transient', intensity: 1.0, sharpness: 0.8 });
    else if (ch === '.') cursor += 100;
    else if (ch === '-') cursor += 300;
    else if (ch === '=') cursor += 1000;
  }
  return events;
});
export const Patterns = {
  success: [{ time: 0, type: 'transient', intensity: 0.4, sharpness: 0.4 }],
  error: [{ time: 0, type: 'transient', intensity: 1.0, sharpness: 0.8 }],
  warning: [{ time: 0, type: 'transient', intensity: 1.0, sharpness: 0.8 }],
  heartbeat: [{ time: 0, type: 'transient', intensity: 0.4, sharpness: 0.4 }],
  tripleClick: [{ time: 0, type: 'transient', intensity: 0.4, sharpness: 0.4 }],
  notification: [{ time: 0, type: 'transient', intensity: 0.4, sharpness: 0.4 }],
};

const RNHapticFeedback = {
  trigger,
  stop,
  isSupported,
  triggerPattern,
  playAHAP,
  getSystemHapticStatus,
};

export default RNHapticFeedback;
