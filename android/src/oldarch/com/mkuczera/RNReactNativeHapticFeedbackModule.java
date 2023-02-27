package com.mkuczera;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

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
}
