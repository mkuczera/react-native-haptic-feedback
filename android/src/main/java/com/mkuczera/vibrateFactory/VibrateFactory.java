package com.mkuczera.vibrateFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.os.Build;
import android.os.Vibrator;
import android.os.VibrationAttributes;
import android.os.VibrationEffect;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;


public class VibrateFactory {
    private static final String TAG = "RNHapticFeedback";
    static Map<String, Vibrate> vibrateMap = new HashMap<>();
    static {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // API 31+: high-quality Composition primitives
            vibrateMap.put("impactLight",    new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_TICK, 0.3f));
            vibrateMap.put("impactMedium",   new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.6f));
            vibrateMap.put("impactHeavy",    new VibrateWithComposition(VibrationEffect.Composition.PRIMITIVE_THUD, 1.0f));
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
        // Haptic-constant type fallbacks (used when hidden view not available)
        vibrateMap.put("clockTick",             new VibrateWithDuration(new long[]{0, 15}));
        vibrateMap.put("contextClick",          new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("keyboardPress",         new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("keyboardRelease",       new VibrateWithDuration(new long[]{0, 10}));
        vibrateMap.put("keyboardTap",           new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("longPress",             new VibrateWithDuration(new long[]{0, 40}));
        vibrateMap.put("textHandleMove",        new VibrateWithDuration(new long[]{0, 10}));
        vibrateMap.put("virtualKey",            new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("virtualKeyRelease",     new VibrateWithDuration(new long[]{0, 10}));
        // New API 30+ types — fallback waveforms for pre-30 devices
        vibrateMap.put("confirm",              new VibrateWithDuration(new long[]{0, 40, 60, 20}));
        vibrateMap.put("reject",               new VibrateWithDuration(new long[]{0, 60, 40, 30}));
        vibrateMap.put("gestureStart",         new VibrateWithDuration(new long[]{0, 15}));
        vibrateMap.put("gestureEnd",           new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("segmentTick",          new VibrateWithDuration(new long[]{0, 10}));
        vibrateMap.put("segmentFrequentTick",  new VibrateWithDuration(new long[]{0, 8}));
        vibrateMap.put("toggleOn",                   new VibrateWithDuration(new long[]{0, 15, 30, 25}));
        vibrateMap.put("toggleOff",                  new VibrateWithDuration(new long[]{0, 25, 30, 15}));
        // API 34 types — fallback waveforms for pre-34 devices
        vibrateMap.put("dragStart",                  new VibrateWithDuration(new long[]{0, 15}));
        vibrateMap.put("gestureThresholdActivate",   new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("gestureThresholdDeactivate", new VibrateWithDuration(new long[]{0, 10}));
        // noHaptics intentionally has no entry — callers should skip it
        // effect* types require API 29 (createPredefined); fall back to durations on older devices
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            vibrateMap.put("effectClick",       new VibrateWithCreatePredefined(VibrationEffect.EFFECT_CLICK));
            vibrateMap.put("effectDoubleClick", new VibrateWithCreatePredefined(VibrationEffect.EFFECT_DOUBLE_CLICK));
            vibrateMap.put("effectHeavyClick",  new VibrateWithCreatePredefined(VibrationEffect.EFFECT_HEAVY_CLICK));
            vibrateMap.put("effectTick",        new VibrateWithCreatePredefined(VibrationEffect.EFFECT_TICK));
        } else {
            vibrateMap.put("effectClick",       new VibrateWithDuration(new long[]{0, 20}));
            vibrateMap.put("effectDoubleClick", new VibrateWithDuration(new long[]{0, 20, 40, 20}));
            vibrateMap.put("effectHeavyClick",  new VibrateWithDuration(new long[]{0, 50}));
            vibrateMap.put("effectTick",        new VibrateWithDuration(new long[]{0, 15}));
        }
    }

    public static Vibrate getVibration(String type) {
        return vibrateMap.get(type);
    }

    /** Play a custom pattern from a JS HapticEvent array */
    public static void vibratePattern(Vibrator v, ReadableArray events) {
        if (events == null || events.size() == 0) return;

        // Copy to list and sort by time so out-of-order input still produces correct gaps
        int rawCount = events.size();
        List<ReadableMap> sorted = new ArrayList<>(rawCount);
        for (int i = 0; i < rawCount; i++) {
            ReadableMap evt = events.getMap(i);
            if (evt != null) sorted.add(evt);
        }
        Collections.sort(sorted, (a, b) -> Double.compare(
            a.hasKey("time") ? a.getDouble("time") : 0,
            b.hasKey("time") ? b.getDouble("time") : 0
        ));

        // Build parallel timing/amplitude arrays from the sorted events
        // We interleave off-then-on durations for createWaveform
        int count = sorted.size();
        long[] timings = new long[count * 2];
        int[] amplitudes = new int[count * 2];

        long prevEnd = 0;
        int idx = 0;

        for (ReadableMap evt : sorted) {
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
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                VibrationEffect effect = VibrationEffect.createWaveform(finalTimings, finalAmplitudes, -1);
                VibrationAttributes attrs = new VibrationAttributes.Builder()
                    .setUsage(VibrationAttributes.USAGE_TOUCH)
                    .build();
                v.vibrate(effect, attrs);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createWaveform(finalTimings, finalAmplitudes, -1));
            } else {
                v.vibrate(finalTimings, -1);
            }
        } catch (Exception e) {
            Log.w(TAG, "vibratePattern failed", e);
        }
    }
}
