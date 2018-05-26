import {NativeModules, Platform} from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', enableVibrateFallback = false) => {
        try {
            if (Platform.OS === 'ios') {
                NativeModules.RNReactNativeHapticFeedback.trigger(type, enableVibrateFallback);
            } else {
                NativeModules.RNReactNativeHapticFeedback.trigger(type);
            }
        } catch (err) {
            console.warn('RNReactNativeHapticFeedback is not available');
        }
    }
}

export default RNReactNativeHapticFeedback;