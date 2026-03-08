package com.mkuczera.vibrateFactory;

import android.os.Build;
import android.os.Vibrator;
import android.os.VibrationEffect;

import androidx.annotation.RequiresApi;

/**
 * Uses VibrationEffect.Composition (API 31+) for high-quality haptic primitives.
 */
@RequiresApi(api = Build.VERSION_CODES.S)
public class VibrateWithComposition implements Vibrate {

    private final int primitiveId;
    private final float scale;

    public VibrateWithComposition(int primitiveId, float scale) {
        this.primitiveId = primitiveId;
        this.scale = scale;
    }

    @Override
    public void apply(Vibrator v) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return;
        try {
            if (v.hasVibrator()) {
                VibrationEffect effect = VibrationEffect.startComposition()
                    .addPrimitive(primitiveId, scale)
                    .compose();
                v.vibrate(effect);
            }
        } catch (Exception e) {}
    }
}
