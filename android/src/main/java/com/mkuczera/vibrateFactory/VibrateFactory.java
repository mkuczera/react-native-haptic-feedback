package com.mkuczera.vibrateFactory;

import java.util.Map;
import java.util.HashMap;

import android.os.Build;
import android.os.Vibrator;
import android.os.VibrationEffect;
import android.view.HapticFeedbackConstants;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;


public class VibrateFactory {
    static Map<String, Vibrate> vibrateMap = new HashMap<>();
    static {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // API 31+: high-quality Composition primitives
            vibrateMap.put("impactLight",    new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_TICK, 0.5f));
            vibrateMap.put("impactMedium",   new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.7f));
            vibrateMap.put("impactHeavy",    new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_HEAVY_CLICK, 1.0f));
            vibrateMap.put("rigid",          new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.9f));
            vibrateMap.put("soft",           new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_TICK, 0.3f));
            vibrateMap.put("selection",      new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_TICK, 0.4f));
            // Notifications use multi-primitive sequences via waveform fallback
            vibrateMap.put("notificationSuccess", new VibrateWithDuration(new long[]{0, 40, 60, 20}));
            vibrateMap.put("notificationWarning",  new VibrateWithDuration(new long[]{0, 20, 60, 40}));
            vibrateMap.put("notificationError",    new VibrateWithDuration(new long[]{0, 20, 40, 30, 40, 40}));
        } else {
            vibrateMap.put("impactLight",    new VibrateWithDuration(new long[]{0, 20}));
            vibrateMap.put("impactMedium",   new VibrateWithDuration(new long[]{0, 40}));
            vibrateMap.put("impactHeavy",    new VibrateWithDuration(new long[]{0, 60}));
            vibrateMap.put("notificationSuccess", new VibrateWithDuration(new long[]{0, 40, 60, 20}));
            vibrateMap.put("notificationWarning",  new VibrateWithDuration(new long[]{0, 20, 60, 40}));
            vibrateMap.put("notificationError",    new VibrateWithDuration(new long[]{0, 20, 40, 30, 40, 40}));
            vibrateMap.put("rigid",   new VibrateWithDuration(new long[]{0, 30}));
            vibrateMap.put("soft",    new VibrateWithDuration(new long[]{0, 10}));
            vibrateMap.put("selection", new VibrateWithDuration(new long[]{0, 10}));
        }
        vibrateMap.put("clockTick", new VibrateWithHapticConstant(HapticFeedbackConstants.CLOCK_TICK));
        vibrateMap.put("contextClick", new VibrateWithHapticConstant(HapticFeedbackConstants.CONTEXT_CLICK));
        vibrateMap.put("keyboardPress", new VibrateWithHapticConstant(HapticFeedbackConstants.KEYBOARD_PRESS));
        vibrateMap.put("keyboardRelease", new VibrateWithHapticConstant(HapticFeedbackConstants.KEYBOARD_RELEASE));
        vibrateMap.put("keyboardTap", new VibrateWithHapticConstant(HapticFeedbackConstants.KEYBOARD_TAP));
        vibrateMap.put("longPress", new VibrateWithHapticConstant(HapticFeedbackConstants.LONG_PRESS));
        vibrateMap.put("textHandleMove", new VibrateWithHapticConstant(HapticFeedbackConstants.TEXT_HANDLE_MOVE));
        vibrateMap.put("virtualKey", new VibrateWithHapticConstant(HapticFeedbackConstants.VIRTUAL_KEY));
        vibrateMap.put("virtualKeyRelease", new VibrateWithHapticConstant(HapticFeedbackConstants.VIRTUAL_KEY_RELEASE));
        vibrateMap.put("effectClick", new VibrateWithCreatePredefined(VibrationEffect.EFFECT_CLICK));
        vibrateMap.put("effectDoubleClick", new VibrateWithCreatePredefined(VibrationEffect.EFFECT_DOUBLE_CLICK));
        vibrateMap.put("effectHeavyClick", new VibrateWithCreatePredefined(VibrationEffect.EFFECT_HEAVY_CLICK));
        vibrateMap.put("effectTick", new VibrateWithCreatePredefined(VibrationEffect.EFFECT_TICK));
    }

    public static Vibrate getVibration(String type) {
        return vibrateMap.get(type);
    }

    /** Play a custom pattern from a JS HapticEvent array */
    public static void vibratePattern(Vibrator v, ReadableArray events) {
        if (events == null || events.size() == 0) return;

        // Build parallel timing/amplitude arrays from the events
        // We interleave off-then-on durations for createWaveform
        // Collect each event as (offsetMs, durationMs, amplitude)
        int count = events.size();
        long[] timings = new long[count * 2];
        int[] amplitudes = new int[count * 2];

        long prevEnd = 0;
        int idx = 0;

        for (int i = 0; i < count; i++) {
            ReadableMap evt = events.getMap(i);
            if (evt == null) continue;

            long timeMs = evt.hasKey("time") ? (long) evt.getDouble("time") : 0;
            long durationMs = evt.hasKey("duration") ? (long) evt.getDouble("duration") : 50;
            double intensityD = evt.hasKey("intensity") ? evt.getDouble("intensity") : 0.5;
            int amplitude = (int) Math.round(intensityD * 255);

            // Gap before this event
            long gap = Math.max(0, timeMs - prevEnd);
            timings[idx] = gap;
            amplitudes[idx] = 0;
            idx++;

            // The event itself
            timings[idx] = durationMs;
            amplitudes[idx] = Math.max(1, Math.min(255, amplitude));
            idx++;

            prevEnd = timeMs + durationMs;
        }

        // Trim to actual used length
        long[] finalTimings = new long[idx];
        int[] finalAmplitudes = new int[idx];
        System.arraycopy(timings, 0, finalTimings, 0, idx);
        System.arraycopy(amplitudes, 0, finalAmplitudes, 0, idx);

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createWaveform(finalTimings, finalAmplitudes, -1));
            } else {
                v.vibrate(finalTimings, -1);
            }
        } catch (Exception e) {}
    }
}
