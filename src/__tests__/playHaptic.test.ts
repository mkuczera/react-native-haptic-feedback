/**
 * playHaptic tests — isolated so Platform.OS can be overridden per-test
 * without affecting the rest of the suite.
 */

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

jest.mock('../hapticFeedback', () => ({
  isEnabled: jest.fn().mockReturnValue(true),
  playAHAP: jest.fn().mockResolvedValue(undefined),
  triggerPattern: jest.fn(),
}));

import { Platform } from 'react-native';
import RNHapticFeedback from '../hapticFeedback';
import { playHaptic } from '../utils/playHaptic';

const mockIsEnabled = RNHapticFeedback.isEnabled as jest.Mock;
const mockPlayAHAP = RNHapticFeedback.playAHAP as jest.Mock;
const mockTriggerPattern = RNHapticFeedback.triggerPattern as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockIsEnabled.mockReturnValue(true);
  (Platform as any).OS = 'ios';
});

describe("playHaptic", () => {
  it("calls playAHAP on iOS", async () => {
    (Platform as any).OS = 'ios';
    await playHaptic('effect.ahap', []);
    expect(mockPlayAHAP).toHaveBeenCalledWith('effect.ahap');
    expect(mockTriggerPattern).not.toHaveBeenCalled();
  });

  it("calls triggerPattern on Android with fallback events", async () => {
    (Platform as any).OS = 'android';
    const fallback = [{ time: 0, type: 'transient' as const, intensity: 0.5, sharpness: 0.5 }];
    await playHaptic('effect.ahap', fallback);
    expect(mockTriggerPattern).toHaveBeenCalledWith(fallback, undefined);
    expect(mockPlayAHAP).not.toHaveBeenCalled();
  });

  it("forwards options to triggerPattern on Android", async () => {
    (Platform as any).OS = 'android';
    const fallback = [{ time: 0, type: 'transient' as const, intensity: 0.5, sharpness: 0.5 }];
    const options = { enableVibrateFallback: true };
    await playHaptic('effect.ahap', fallback, options);
    expect(mockTriggerPattern).toHaveBeenCalledWith(fallback, options);
  });

  it("does nothing when haptics are disabled (iOS)", async () => {
    mockIsEnabled.mockReturnValue(false);
    await playHaptic('effect.ahap', []);
    expect(mockPlayAHAP).not.toHaveBeenCalled();
    expect(mockTriggerPattern).not.toHaveBeenCalled();
  });

  it("does nothing when haptics are disabled (Android)", async () => {
    (Platform as any).OS = 'android';
    mockIsEnabled.mockReturnValue(false);
    await playHaptic('effect.ahap', [{ time: 0, type: 'transient' as const, intensity: 0.5, sharpness: 0.5 }]);
    expect(mockPlayAHAP).not.toHaveBeenCalled();
    expect(mockTriggerPattern).not.toHaveBeenCalled();
  });
});
