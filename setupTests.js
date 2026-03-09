global.__DEV__ = true;

// useMemo requires a React renderer to be active. Tests call hooks bare (not
// inside a component), so replace useMemo with a simple synchronous factory
// call — memoization behaviour is irrelevant for unit tests.
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (fn) => fn(),
}));

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
