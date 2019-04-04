import { NativeModules, Platform } from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', options = {}) => {
        // if options is a bool we're using a v1.6 api. This only effects iOS
        if (typeof options === 'boolean' && Platform === 'ios') {
            return trigger(type, options)
        }

        const mergedOptions = {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: false,
            ...options
        }

        trigger(type, mergedOptions)
    }
}

const trigger(type, options) {
    try {
        NativeModules.RNReactNativeHapticFeedback.trigger(type, options);
    } catch (err) {
        console.warn('RNReactNativeHapticFeedback is not available');
    }
}

export default RNReactNativeHapticFeedback;