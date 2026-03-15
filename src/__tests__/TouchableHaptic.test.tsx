/**
 * TouchableHaptic tests — react-native is mocked so that Pressable's deep
 * import chain (processColor → Platform → …) doesn't pull in native modules
 * that are unavailable in the node test environment.
 */

// Must be hoisted before any imports
jest.mock("react-native", () => ({
  Pressable: jest.fn(),
}));

jest.mock("../hapticFeedback", () => ({
  trigger: jest.fn(),
}));

import React from "react";
import type { GestureResponderEvent } from "react-native";
import { TouchableHaptic } from "../components/TouchableHaptic";
import RNHapticFeedback from "../hapticFeedback";
import { HapticFeedbackTypes } from "../types";

type TestElement = React.ReactElement<{
  onPressIn: (e: GestureResponderEvent) => void;
  onPress: (e: GestureResponderEvent) => void;
  onLongPress: (e: GestureResponderEvent) => void;
}>;

const mockTrigger = RNHapticFeedback.trigger as jest.Mock;
const mockEvent = {} as unknown as GestureResponderEvent;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TouchableHaptic", () => {
  it("fires haptic on pressIn by default", () => {
    const el = TouchableHaptic({
      hapticType: HapticFeedbackTypes.impactMedium,
    }) as unknown as TestElement;
    el.props.onPressIn(mockEvent);
    expect(mockTrigger).toHaveBeenCalledWith("impactMedium", undefined);
  });

  it("does not fire haptic on press when trigger is onPressIn", () => {
    const el = TouchableHaptic({
      hapticType: HapticFeedbackTypes.impactMedium,
      hapticTrigger: "onPressIn",
    }) as unknown as TestElement;
    el.props.onPress(mockEvent);
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it("fires haptic on press when hapticTrigger is onPress", () => {
    const el = TouchableHaptic({
      hapticType: HapticFeedbackTypes.impactLight,
      hapticTrigger: "onPress",
    }) as unknown as TestElement;
    el.props.onPress(mockEvent);
    expect(mockTrigger).toHaveBeenCalledWith("impactLight", undefined);
  });

  it("does not fire haptic on pressIn when trigger is onPress", () => {
    const el = TouchableHaptic({
      hapticType: HapticFeedbackTypes.impactLight,
      hapticTrigger: "onPress",
    }) as unknown as TestElement;
    el.props.onPressIn(mockEvent);
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it("fires haptic on longPress when hapticTrigger is onLongPress", () => {
    const el = TouchableHaptic({
      hapticType: HapticFeedbackTypes.impactHeavy,
      hapticTrigger: "onLongPress",
    }) as unknown as TestElement;
    el.props.onLongPress(mockEvent);
    expect(mockTrigger).toHaveBeenCalledWith("impactHeavy", undefined);
  });

  it("does not fire haptic on pressIn when trigger is onLongPress", () => {
    const el = TouchableHaptic({
      hapticType: HapticFeedbackTypes.impactHeavy,
      hapticTrigger: "onLongPress",
    }) as unknown as TestElement;
    el.props.onPressIn(mockEvent);
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it("still calls the original onPressIn handler", () => {
    const onPressIn = jest.fn();
    const el = TouchableHaptic({ onPressIn }) as unknown as TestElement;
    el.props.onPressIn(mockEvent);
    expect(onPressIn).toHaveBeenCalledWith(mockEvent);
  });

  it("still calls the original onPress handler", () => {
    const onPress = jest.fn();
    const el = TouchableHaptic({
      hapticTrigger: "onPress",
      onPress,
    }) as unknown as TestElement;
    el.props.onPress(mockEvent);
    expect(onPress).toHaveBeenCalledWith(mockEvent);
  });

  it("still calls the original onLongPress handler", () => {
    const onLongPress = jest.fn();
    const el = TouchableHaptic({
      hapticTrigger: "onLongPress",
      onLongPress,
    }) as unknown as TestElement;
    el.props.onLongPress(mockEvent);
    expect(onLongPress).toHaveBeenCalledWith(mockEvent);
  });

  it("forwards hapticOptions to trigger", () => {
    const hapticOptions = { enableVibrateFallback: true };
    const el = TouchableHaptic({ hapticOptions }) as unknown as TestElement;
    el.props.onPressIn(mockEvent);
    expect(mockTrigger).toHaveBeenCalledWith("impactMedium", hapticOptions);
  });

  it("uses impactMedium as default hapticType", () => {
    const el = TouchableHaptic({}) as unknown as TestElement;
    el.props.onPressIn(mockEvent);
    expect(mockTrigger).toHaveBeenCalledWith("impactMedium", undefined);
  });
});
