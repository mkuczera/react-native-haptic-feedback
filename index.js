import { NativeModules, Platform } from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', options = {}) => {
        try {
            if (typeof options === 'boolean') {
                if (Platform === 'ios') {
                    NativeModules.RNReactNativeHapticFeedback.trigger_deprecated(type, options);
                } else {
                    NativeModules.RNReactNativeHapticFeedback.trigger(type);
                }
            } else {
                NativeModules.RNReactNativeHapticFeedback.trigger(type, options);
            }
        } catch (err) {
            console.warn('RNReactNativeHapticFeedback is not available');
        }
    }
}

export default RNReactNativeHapticFeedback;