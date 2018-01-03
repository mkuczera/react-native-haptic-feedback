
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.os.Vibrator;

public class RNReactNativeHapticFeedbackModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private Vibrator vibrator;

  @Override
  protected void onCreate(Bundle savedInstanceState)
  {
      super.onCreate(savedInstanceState);
      vibrator = (Vibrator) this.getSystemService(VIBRATOR_SERVICE);
  }

  public RNReactNativeHapticFeedbackModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNReactNativeHapticFeedback";
  }

  public void trigger(String type) {
    vibrator.vibrate(50);
  }
}