import { NativeModules, Platform } from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', options = {}) => {
        const mergedOptions = {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: false,
            ...options
        }

        try {
            if (typeof options === 'boolean' && Platform === 'ios') {
                NativeModules.RNReactNativeHapticFeedback.trigger(type, options);
            } else {
                NativeModules.RNReactNativeHapticFeedback.trigger(type, mergedOptions);
            }
        } catch (err) {
            console.warn('RNReactNativeHapticFeedback is not available');
        }
    }
}

export default RNReactNativeHapticFeedback;