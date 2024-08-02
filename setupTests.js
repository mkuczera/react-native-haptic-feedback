global.__DEV__ = true;
global.__turboModuleProxy = null;

jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  RNHapticFeedback: {
    trigger: jest.fn(),
  },
}));
