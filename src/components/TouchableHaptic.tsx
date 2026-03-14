import { useCallback } from "react";
import { Pressable } from "react-native";
import type { PressableProps, GestureResponderEvent } from "react-native";
import RNHapticFeedback from "../hapticFeedback";
import { HapticFeedbackTypes } from "../types";
import type { HapticOptions } from "../types";

export interface TouchableHapticProps extends PressableProps {
  hapticType?: HapticFeedbackTypes | keyof typeof HapticFeedbackTypes;
  hapticTrigger?: "onPressIn" | "onPress" | "onLongPress";
  hapticOptions?: HapticOptions;
}

export function TouchableHaptic({
  hapticType = HapticFeedbackTypes.impactMedium,
  hapticTrigger = "onPressIn",
  hapticOptions,
  onPressIn,
  onPress,
  onLongPress,
  ...rest
}: TouchableHapticProps) {
  const fireHaptic = useCallback(() => {
    RNHapticFeedback.trigger(hapticType, hapticOptions);
  }, [hapticType, hapticOptions]);

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (hapticTrigger === "onPressIn") fireHaptic();
      onPressIn?.(e);
    },
    [hapticTrigger, fireHaptic, onPressIn],
  );

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (hapticTrigger === "onPress") fireHaptic();
      onPress?.(e);
    },
    [hapticTrigger, fireHaptic, onPress],
  );

  const handleLongPress = useCallback(
    (e: GestureResponderEvent) => {
      if (hapticTrigger === "onLongPress") fireHaptic();
      onLongPress?.(e);
    },
    [hapticTrigger, fireHaptic, onLongPress],
  );

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPress={handlePress}
      onLongPress={handleLongPress}
      {...rest}
    />
  );
}
