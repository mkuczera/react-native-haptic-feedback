package com.mkuczera.haptic.vibrateFactory;

import android.os.Build;
import android.os.Vibrator;
import android.os.VibrationAttributes;
import android.os.VibrationEffect;
import android.util.Log;

import androidx.annotation.RequiresApi;

/**
 * Uses VibrationEffect.Composition (API 31+) for high-quality haptic primitives.
 * Falls back to a waveform if the primitive is not supported by the device.
 */
@RequiresApi(api = Build.VERSION_CODES.S)
public class VibrateWithComposition implements Vibrate {

    private static final String TAG = "RNHapticFeedback";
    private final int primitiveId;
    private final float scale;
    private final Vibrate fallback;

    public VibrateWithComposition(int primitiveId, float scale, Vibrate fallback) {
        this.primitiveId = primitiveId;
        this.scale = scale;
        this.fallback = fallback;
    }

    @Override
    public void apply(Vibrator v) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return;
        try {
            if (v.hasVibrator() && v.arePrimitivesSupported(primitiveId)[0]) {
                VibrationEffect effect = VibrationEffect.startComposition()
                    .addPrimitive(primitiveId, scale)
                    .compose();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    VibrationAttributes attrs = new VibrationAttributes.Builder()
                        .setUsage(VibrationAttributes.USAGE_TOUCH)
                        .build();
                    v.vibrate(effect, attrs);
                } else {
                    v.vibrate(effect);
                }
                return;
            }
        } catch (Exception e) {
            Log.w(TAG, "VibrateWithComposition failed", e);
        }
        if (fallback != null) fallback.apply(v);
    }
}
