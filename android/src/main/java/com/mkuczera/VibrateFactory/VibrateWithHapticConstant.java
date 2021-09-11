
package com.mkuczera;

import android.os.Vibrator;

public class VibrateWithHapticConstant implements Vibrate {
    int hapticConstant = 0;

    public VibrateWithHapticConstant(int hapticConstant) {
        this.hapticConstant = hapticConstant;
    }

    @Override
    public void apply(Vibrator v) {
        v.vibrate(this.hapticConstant);
    }
}
