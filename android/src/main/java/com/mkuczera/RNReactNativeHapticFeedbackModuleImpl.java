package com.mkuczera;

import android.os.Vibrator;
import android.content.Context;
import android.provider.Settings;
import android.media.AudioManager;
import com.mkuczera.vibrateFactory.VibrateFactory;
import com.mkuczera.vibrateFactory.Vibrate;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class RNReactNativeHapticFeedbackModuleImpl {

    public static final String NAME = "RNHapticFeedback";

    public static boolean isVibrationEnabled(Context context) {
      Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
      AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);

      // 1. Check the vibration function of the user's device
      boolean hasVibrator = vibrator != null && vibrator.hasVibrator();

      // 2. Check if the user has turned on the sound
      boolean isVolumeOn = audioManager.getRingerMode() != AudioManager.RINGER_MODE_SILENT;

      // 3. Check if the user has set the vibrate mode
      boolean isVibrateMode = audioManager.getRingerMode() == AudioManager.RINGER_MODE_VIBRATE;

      return hasVibrator && (isVolumeOn || isVibrateMode);
   }

    public static void trigger(ReactApplicationContext reactContext, String type, ReadableMap options) {
      // Check system settings, if disabled and we're not explicitly ignoring then return immediatly
      boolean ignoreAndroidSystemSettings = options.getBoolean("ignoreAndroidSystemSettings");
      boolean isVibrationEnabled = isVibrationEnabled(reactContext);

      if (ignoreAndroidSystemSettings == false && !isVibrationEnabled) return;
      Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
      Vibrate targetVibration = VibrateFactory.getVibration(type);

      if (v == null || targetVibration == null) return;

      targetVibration.apply(v);
    }
}
