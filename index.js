import { NativeModules } from 'react-native';

const defaultOptions = {
    enableVibrateFallback: false,
    ignoreAndroidSystemSettings: false,
}

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection', options = {}) => {
        const triggerOptions = createTriggerOptions(options)

        try {
            NativeModules.RNReactNativeHapticFeedback.trigger(type, triggerOptions);
        } catch (err) {
            console.warn('RNReactNativeHapticFeedback is not available');
        }
    }
}

const createTriggerOptions = options => {
    // if options is a boolean we're using an api <=1.6 and we should pass use it to set the enableVibrateFallback option
    if (typeof options === 'boolean') {
        return {
            ...defaultOptions,
            enableVibrateFallback: options
        }
    } else {
        return { ...defaultOptions, ...options }
    }
}

export default RNReactNativeHapticFeedback;
