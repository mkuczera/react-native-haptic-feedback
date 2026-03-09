package com.mkuczera;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Promise;

public class RNReactNativeHapticFeedbackModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    RNReactNativeHapticFeedbackModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return RNReactNativeHapticFeedbackModuleImpl.NAME;
    }

    @ReactMethod
    public void trigger(String type, ReadableMap options) {
        RNReactNativeHapticFeedbackModuleImpl.trigger(this.reactContext, type, options);
    }

    @ReactMethod
    public void stop() {
        RNReactNativeHapticFeedbackModuleImpl.stop(this.reactContext);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSupported() {
        return RNReactNativeHapticFeedbackModuleImpl.isSupported(this.reactContext);
    }

    @ReactMethod
    public void triggerPattern(ReadableArray events, ReadableMap options) {
        RNReactNativeHapticFeedbackModuleImpl.triggerPattern(this.reactContext, events, options);
    }

    @ReactMethod
    public void playAHAP(String fileName, Promise promise) {
        // AHAP playback is iOS-only; resolve immediately on Android
        promise.resolve(null);
    }

    @ReactMethod
    public void getSystemHapticStatus(Promise promise) {
        RNReactNativeHapticFeedbackModuleImpl.getSystemHapticStatus(this.reactContext, promise);
    }
}
