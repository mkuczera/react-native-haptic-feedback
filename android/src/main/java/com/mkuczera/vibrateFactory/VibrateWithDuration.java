package com.mkuczera.vibrateFactory;

import android.os.Build;
import android.os.Vibrator;
import android.os.VibrationAttributes;
import android.os.VibrationEffect;
import android.util.Log;

public class VibrateWithDuration implements Vibrate {
    private static final String TAG = "RNHapticFeedback";
    long durations[] = {};

    public VibrateWithDuration(long[] durations) {
        this.durations = durations;
    }

    @Override
    public void apply(Vibrator v) {
        try {
            if (v.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    VibrationEffect effect = VibrationEffect.createWaveform(this.durations, -1);
                    VibrationAttributes attrs = new VibrationAttributes.Builder()
                        .setUsage(VibrationAttributes.USAGE_TOUCH)
                        .build();
                    v.vibrate(effect, attrs);
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createWaveform(this.durations, -1));
                } else {
                    v.vibrate(this.durations, -1);
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "VibrateWithDuration failed", e);
        }
    }
}
