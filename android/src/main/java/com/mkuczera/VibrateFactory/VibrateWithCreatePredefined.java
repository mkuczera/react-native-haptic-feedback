package com.mkuczera;

import android.os.Vibrator;
import android.os.VibrationEffect;
import android.os.Build;

public class VibrateWithCreatePredefined implements Vibrate {
    int hapticConstant = 0;

    VibrateWithCreatePredefined(int hapticConstant) {
        this.hapticConstant = hapticConstant;
    }

    @Override
    public void apply(Vibrator v) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            
            return;
        }

        try {
            if (v.hasVibrator()) {
                v.vibrate(VibrationEffect.createPredefined(this.hapticConstant));
            }
        } catch (Exception e) {}
    }
}
