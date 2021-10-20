
package com.mkuczera;

import android.os.Vibrator;

public class VibrateWithDuration implements Vibrate {
    long durations[] = {};

    public VibrateWithDuration(long[] durations) {
        this.durations = durations;
    }

    @Override
    public void apply(Vibrator v) {
        v.vibrate(this.durations, -1);
    }
}
