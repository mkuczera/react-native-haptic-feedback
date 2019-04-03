import { NativeModules, Platform } from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', options = {}) => {
        const mergedOptions = {
            ignoreAndroidSystemSettings: false,
            ...options
        }

        try {
            if (typeof options === 'boolean') {
                if (Platform === 'ios') {
                    NativeModules.RNReactNativeHapticFeedback.trigger_deprecated(type, options);
                } else {
                    NativeModules.RNReactNativeHapticFeedback.trigger(type, mergedOptions);
                }
            } else {
                NativeModules.RNReactNativeHapticFeedback.trigger(type, mergedOptions);
            }
        } catch (err) {
            console.warn('RNReactNativeHapticFeedback is not available');
        }
    }
}

export default RNReactNativeHapticFeedback;