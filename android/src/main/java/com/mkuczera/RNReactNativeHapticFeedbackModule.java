
package com.mkuczera;

import android.os.Vibrator;
import android.content.Context;
import android.provider.Settings;
import com.mkuczera.VibrateFactory;
import com.mkuczera.Vibrate;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class RNReactNativeHapticFeedbackModule extends ReactContextBaseJavaModule {

  ReactApplicationContext reactContext;

  public RNReactNativeHapticFeedbackModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNReactNativeHapticFeedback";
  }

  @ReactMethod
  public void trigger(String type, ReadableMap options) {
    // Check system settings, if disabled and we're not explicitly ignoring then return immediatly
    boolean ignoreAndroidSystemSettings = options.getBoolean("ignoreAndroidSystemSettings");
    int hapticEnabledAndroidSystemSettings = Settings.System.getInt(this.reactContext.getContentResolver(), Settings.System.HAPTIC_FEEDBACK_ENABLED, 0);
    if (ignoreAndroidSystemSettings == false && hapticEnabledAndroidSystemSettings == 0) return;

    Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
    Vibrate targetVibration = VibrateFactory.getVibration(type);

    if (v == null || targetVibration == null) return;

    targetVibration.apply(v);
  }
}
