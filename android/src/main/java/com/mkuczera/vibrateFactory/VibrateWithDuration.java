package com.mkuczera.vibrateFactory;

import android.os.Build;
import android.os.Vibrator;
import android.os.VibrationEffect;

public class VibrateWithDuration implements Vibrate {
    long durations[] = {};

    public VibrateWithDuration(long[] durations) {
        this.durations = durations;
    }

    @Override
    public void apply(Vibrator v) {
        try {
            if (v.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createWaveform(this.durations, -1));
                } else {
                    v.vibrate(this.durations, -1);
                }
            }
        } catch (Exception e) {}
    }
}
