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

    private static boolean isVibrationEnabled(Context context, Vibrator vibrator) {
      // 1. Check the vibration function of the user's device
      if (!vibrator.hasVibrator()) return false;

      AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
      if (audioManager == null) return false;

      // 2. Check if the user has turned on the sound
      boolean isVolumeOn = audioManager.getRingerMode() != AudioManager.RINGER_MODE_SILENT;
      if (isVolumeOn) return true;

      // 3. Check if the user has set the vibrate mode
      boolean isVibrateMode = audioManager.getRingerMode() == AudioManager.RINGER_MODE_VIBRATE;
      return isVibrateMode;
   }

    public static void trigger(ReactApplicationContext reactContext, String type, ReadableMap options) {
      Vibrator vibrator = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
      if (vibrator == null) return;

      // Check system settings, if disabled and we're not explicitly ignoring then return immediatly
      boolean ignoreAndroidSystemSettings = options.getBoolean("ignoreAndroidSystemSettings");
      if (ignoreAndroidSystemSettings == false && !isVibrationEnabled(reactContext, vibrator)) return; 

      Vibrate targetVibration = VibrateFactory.getVibration(type);
      if (targetVibration == null) return;

      targetVibration.apply(vibrator);
    }
}
