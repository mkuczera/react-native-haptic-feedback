import { NativeModules, Platform } from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', options = {}) => {
        // if options is a bool we're using a v1.6 api.
        if (typeof options === 'boolean' && Platform === 'ios') {
            triggerHaptic(type, options)
        } else if (typeof options === 'boolean') {
            triggerHaptic(type, {})
        } else {
            const mergedOptions = {
                enableVibrateFallback: false,
                ignoreAndroidSystemSettings: false,
                ...options
            }
    
            triggerHaptic(type, mergedOptions)
        }
    }
}

const triggerHaptic(type, options) {
    try {
        NativeModules.RNReactNativeHapticFeedback.trigger(type, options);
    } catch (err) {
        console.warn('RNReactNativeHapticFeedback is not available');
    }
}

export default RNReactNativeHapticFeedback;