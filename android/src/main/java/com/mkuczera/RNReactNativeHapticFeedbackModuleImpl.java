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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class RNReactNativeHapticFeedbackModuleImpl {

    public static final String NAME = "RNHapticFeedback";

    public static boolean isVibrationEnabled(Context context) {
      Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
      AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);

      boolean hasVibrator = vibrator != null && vibrator.hasVibrator();
      boolean isVolumeOn = audioManager.getRingerMode() != AudioManager.RINGER_MODE_SILENT;
      boolean isVibrateMode = audioManager.getRingerMode() == AudioManager.RINGER_MODE_VIBRATE;

      return hasVibrator && (isVolumeOn || isVibrateMode);
   }

    public static void trigger(ReactApplicationContext reactContext, String type, ReadableMap options) {
      boolean ignoreAndroidSystemSettings = options.getBoolean("ignoreAndroidSystemSettings");
      boolean isVibrationEnabled = isVibrationEnabled(reactContext);

      if (ignoreAndroidSystemSettings == false && !isVibrationEnabled) return;
      Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
      Vibrate targetVibration = VibrateFactory.getVibration(type);

      if (v == null || targetVibration == null) return;

      targetVibration.apply(v);
    }

    public static void stop() {
        // Android vibrations are fire-and-forget; nothing to cancel
    }

    public static boolean isSupported(ReactApplicationContext reactContext) {
        Vibrator vibrator = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
        return vibrator != null && vibrator.hasVibrator();
    }

    public static void triggerPattern(ReactApplicationContext reactContext, ReadableArray events, ReadableMap options) {
        boolean ignoreAndroidSystemSettings = options != null && options.hasKey("ignoreAndroidSystemSettings")
            && options.getBoolean("ignoreAndroidSystemSettings");
        boolean isVibrationEnabled = isVibrationEnabled(reactContext);

        if (!ignoreAndroidSystemSettings && !isVibrationEnabled) return;

        Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
        if (v == null || !v.hasVibrator()) return;

        VibrateFactory.vibratePattern(v, events);
    }

    public static void getSystemHapticStatus(ReactApplicationContext reactContext, Promise promise) {
        try {
            AudioManager audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
            Vibrator vibrator = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);

            boolean hasVibrator = vibrator != null && vibrator.hasVibrator();
            int ringerModeInt = audioManager.getRingerMode();

            String ringerMode;
            boolean vibrationEnabled;

            switch (ringerModeInt) {
                case AudioManager.RINGER_MODE_SILENT:
                    ringerMode = "silent";
                    vibrationEnabled = false;
                    break;
                case AudioManager.RINGER_MODE_VIBRATE:
                    ringerMode = "vibrate";
                    vibrationEnabled = hasVibrator;
                    break;
                default:
                    ringerMode = "normal";
                    vibrationEnabled = hasVibrator;
                    break;
            }

            WritableMap result = Arguments.createMap();
            result.putBoolean("vibrationEnabled", vibrationEnabled);
            result.putString("ringerMode", ringerMode);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("getSystemHapticStatus", e.getMessage());
        }
    }
}
