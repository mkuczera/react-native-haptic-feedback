global.__DEV__ = true;

jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  RNHapticFeedback: {
    trigger: jest.fn(),
    stop: jest.fn(),
    isSupported: jest.fn().mockReturnValue(true),
    triggerPattern: jest.fn(),
    playAHAP: jest.fn().mockResolvedValue(undefined),
    getSystemHapticStatus: jest.fn().mockResolvedValue({ vibrationEnabled: true, ringerMode: 'normal' }),
  },
}));
