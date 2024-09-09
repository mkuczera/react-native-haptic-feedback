global.__DEV__ = true;

jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  RNHapticFeedback: {
    trigger: jest.fn(),
  },
}));
