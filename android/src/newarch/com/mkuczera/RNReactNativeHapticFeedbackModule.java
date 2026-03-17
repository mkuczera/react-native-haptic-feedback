package com.mkuczera;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Promise;

public class RNReactNativeHapticFeedbackModule extends NativeHapticFeedbackSpec {

    ReactApplicationContext reactContext;

    RNReactNativeHapticFeedbackModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    @NonNull
    public String getName() {
        return RNReactNativeHapticFeedbackModuleImpl.NAME;
    }

    @Override
    public void trigger(String type, ReadableMap options) {
        RNReactNativeHapticFeedbackModuleImpl.trigger(this.reactContext, type, options);
    }

    @Override
    public void stop() {
        RNReactNativeHapticFeedbackModuleImpl.stop(this.reactContext);
    }

    @Override
    public boolean isSupported() {
        return RNReactNativeHapticFeedbackModuleImpl.isSupported(this.reactContext);
    }

    @Override
    public void triggerPattern(ReadableArray events, ReadableMap options) {
        RNReactNativeHapticFeedbackModuleImpl.triggerPattern(this.reactContext, events, options);
    }

    @Override
    public void playAHAP(String fileName, Promise promise) {
        // AHAP playback is iOS-only; resolve immediately on Android
        promise.resolve(null);
    }

    @Override
    public void getSystemHapticStatus(Promise promise) {
        RNReactNativeHapticFeedbackModuleImpl.getSystemHapticStatus(this.reactContext, promise);
    }
}
