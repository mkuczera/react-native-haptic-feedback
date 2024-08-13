import React from "react";
import {
  requireNativeComponent,
  TouchableOpacity,
  Platform,
  type ViewStyle,
} from "react-native";

type HapticType = "impact" | "selection" | "notification";

interface Props {
  onPress?: () => void;
  hapticType?: HapticType;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const HapticFeedbackView = requireNativeComponent("HapticFeedbackView");

const TouchableWithHapticFeedback: React.FC<Props> = ({
  onPress,
  hapticType = "impact",
  style,
  children,
  ...props
}) => (
  <TouchableOpacity
    onPress={(event) => {
      if (Platform.OS === "android") {
        this.view.setNativeProps({ feedbackType: hapticType });
      }
      onPress?.(event);
    }}
    {...props}
  >
    <HapticFeedbackView ref={(ref) => (this.view = ref)} style={style}>
      {children}
    </HapticFeedbackView>
  </TouchableOpacity>
);

export default TouchableWithHapticFeedback;
