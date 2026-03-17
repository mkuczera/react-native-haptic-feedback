package com.mkuczera;

import android.app.Activity;
import android.os.Build;
import android.os.Vibrator;
import android.content.Context;
import android.media.AudioManager;
import android.view.HapticFeedbackConstants;
import android.view.View;
import java.util.HashMap;
import java.util.Map;
import com.mkuczera.vibrateFactory.VibrateFactory;
import com.mkuczera.vibrateFactory.Vibrate;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.UiThreadUtil;

public class RNReactNativeHapticFeedbackModuleImpl {

    public static final String NAME = "RNHapticFeedback";

    private static final Map<String, Integer> VIEW_HAPTIC_MAP = new HashMap<>();
    static {
        VIEW_HAPTIC_MAP.put("clockTick",         HapticFeedbackConstants.CLOCK_TICK);
        VIEW_HAPTIC_MAP.put("contextClick",      HapticFeedbackConstants.CONTEXT_CLICK);
        VIEW_HAPTIC_MAP.put("keyboardPress",     HapticFeedbackConstants.KEYBOARD_PRESS);
        VIEW_HAPTIC_MAP.put("keyboardRelease",   HapticFeedbackConstants.KEYBOARD_RELEASE);
        VIEW_HAPTIC_MAP.put("keyboardTap",       HapticFeedbackConstants.KEYBOARD_TAP);
        VIEW_HAPTIC_MAP.put("longPress",         HapticFeedbackConstants.LONG_PRESS);
        VIEW_HAPTIC_MAP.put("textHandleMove",    HapticFeedbackConstants.TEXT_HANDLE_MOVE);
        VIEW_HAPTIC_MAP.put("virtualKey",        HapticFeedbackConstants.VIRTUAL_KEY);
        VIEW_HAPTIC_MAP.put("virtualKeyRelease", HapticFeedbackConstants.VIRTUAL_KEY_RELEASE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // API 30 (Android 11)
            VIEW_HAPTIC_MAP.put("confirm",              HapticFeedbackConstants.CONFIRM);
            VIEW_HAPTIC_MAP.put("reject",               HapticFeedbackConstants.REJECT);
            VIEW_HAPTIC_MAP.put("gestureStart",         HapticFeedbackConstants.GESTURE_START);
            VIEW_HAPTIC_MAP.put("gestureEnd",           HapticFeedbackConstants.GESTURE_END);
            VIEW_HAPTIC_MAP.put("segmentTick",          HapticFeedbackConstants.SEGMENT_TICK);
            VIEW_HAPTIC_MAP.put("segmentFrequentTick",  HapticFeedbackConstants.SEGMENT_FREQUENT_TICK);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // API 34 (Android 14)
            VIEW_HAPTIC_MAP.put("toggleOn",                    HapticFeedbackConstants.TOGGLE_ON);
            VIEW_HAPTIC_MAP.put("toggleOff",                   HapticFeedbackConstants.TOGGLE_OFF);
            VIEW_HAPTIC_MAP.put("dragStart",                   HapticFeedbackConstants.DRAG_START);
            VIEW_HAPTIC_MAP.put("gestureThresholdActivate",    HapticFeedbackConstants.GESTURE_THRESHOLD_ACTIVATE);
            VIEW_HAPTIC_MAP.put("gestureThresholdDeactivate",  HapticFeedbackConstants.GESTURE_THRESHOLD_DEACTIVATE);
            VIEW_HAPTIC_MAP.put("noHaptics",                   HapticFeedbackConstants.NO_HAPTICS);
        }
    }

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
        if (!ignoreAndroidSystemSettings && !isVibrationEnabled(reactContext)) return;

        final Integer hapticConstant = VIEW_HAPTIC_MAP.get(type);
        // performHapticFeedback always obeys system settings and cannot be forced.
        // Only use the decorView path when we are NOT overriding system settings.
        if (!ignoreAndroidSystemSettings && hapticConstant != null) {
            final Activity activity = reactContext.getCurrentActivity();
            if (activity != null) {
                final View decorView = activity.getWindow().getDecorView();
                UiThreadUtil.runOnUiThread(() -> decorView.performHapticFeedback(hapticConstant));
                return;
            }
            // Activity unavailable — fall through to vibrator
        }

        Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
        Vibrate targetVibration = VibrateFactory.getVibration(type);
        if (v == null || targetVibration == null) return;
        targetVibration.apply(v);
    }

    public static void stop(ReactApplicationContext reactContext) {
        Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
        if (v != null) v.cancel();
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
