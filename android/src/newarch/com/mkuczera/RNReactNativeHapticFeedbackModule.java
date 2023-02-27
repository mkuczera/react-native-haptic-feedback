package com.mkuczera;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

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
}
