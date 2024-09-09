import RNHapticFeedback from "../index";
import { HapticFeedbackTypes } from "../types";

const NativeHapticFeedbackMock = require("../codegenSpec/NativeHapticFeedback").default;

describe("RNReactNativeHapticFeedback", () => {
  it("should trigger haptic feedback with default options using NativeModules when turbo module is not used", () => {
    RNHapticFeedback.trigger(HapticFeedbackTypes.selection);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith(
      "selection",
      {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
      },
    );
  });

  it("should trigger haptic feedback with turbo module when enabled", () => {
    RNHapticFeedback.trigger(HapticFeedbackTypes.selection);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith("selection", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
  });

  it("should pass the correct options", () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    };

    RNHapticFeedback.trigger(HapticFeedbackTypes.selection, options);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith(
      "selection",
      options,
    );
  });
});
