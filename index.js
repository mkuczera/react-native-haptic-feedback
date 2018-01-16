import {NativeModules} from 'react-native';

class RNReactNativeHapticFeedback {
    static trigger = (type = 'selection') => {
        try {
            NativeModules.RNReactNativeHapticFeedback.trigger(type);
        } catch (err) {
            console.warn('RNReactNativeHapticFeedback is not available');
        }
    }
}

export default RNReactNativeHapticFeedback;