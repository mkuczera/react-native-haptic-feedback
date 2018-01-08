
package com.reactlibrary;

import android.os.Vibrator;
import android.content.Context;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
  public void trigger(String type) {
    Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
    if (v == null) return;
    int duration = 75;

    switch (type) {
      case "impactLight":
        duration = 15;
        break;
      case "impactMedium":
        duration = 25;
        break;
      case "impactHeavy":
        duration = 35;
        break;
      case "notificationSuccess":
        duration = 50;
        break;
      case "notificationWarning":
        duration = 75;
        break;
      case "notificationError":
        duration = 100;
        break;
      }

      v.vibrate(duration);

  }
}