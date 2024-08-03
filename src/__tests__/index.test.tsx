import { NativeModules } from "react-native";
import { trigger } from "../index";
import { HapticFeedbackTypes } from "../types";

jest.mock("../NativeHapticFeedback", () => ({
  default: {
    trigger: jest.fn(),
  },
}));

const NativeHapticFeedbackMock = require("../NativeHapticFeedback").default;

describe("RNReactNativeHapticFeedback", () => {
  beforeAll(() => {
    global.__turboModuleProxy = null;
    NativeModules.RNHapticFeedback = {
      trigger: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should trigger haptic feedback with default options using NativeModules when turbo module is not used", () => {
    trigger(HapticFeedbackTypes.selection);

    expect(NativeModules.RNHapticFeedback.trigger).toHaveBeenCalledWith(
      "selection",
      {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
      },
    );
  });

  it("should trigger haptic feedback with turbo module when enabled", () => {
    global.__turboModuleProxy = true;

    trigger(HapticFeedbackTypes.selection);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith("selection", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });

    global.__turboModuleProxy = null;
  });

  it("should pass the correct options", () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    };

    trigger(HapticFeedbackTypes.selection, options);

    expect(NativeModules.RNHapticFeedback.trigger).toHaveBeenCalledWith(
      "selection",
      options,
    );
  });

  it("should handle the case when options is a boolean", () => {
    // @ts-expect-error - we're testing the case when options is a boolean for deprecated behavior
    trigger(HapticFeedbackTypes.selection, true);

    expect(NativeModules.RNHapticFeedback.trigger).toHaveBeenCalledWith(
      "selection",
      {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      },
    );
  });

  it("should warn when haptic feedback module is not available", () => {
    delete NativeModules.RNHapticFeedback;

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    trigger(HapticFeedbackTypes.selection);

    expect(warnSpy).toHaveBeenCalledWith(
      "RNReactNativeHapticFeedback is not available",
    );

    warnSpy.mockRestore();
  });
});
