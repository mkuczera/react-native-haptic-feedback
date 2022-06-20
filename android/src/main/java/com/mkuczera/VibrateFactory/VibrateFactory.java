package com.mkuczera;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import android.view.HapticFeedbackConstants;
import android.os.VibrationEffect;
import com.mkuczera.Vibrate;
import com.mkuczera.VibrateWithDuration;
import com.mkuczera.VibrateWithHapticConstant;
import com.mkuczera.VibrateWithCreatePredefined;

public class VibrateFactory {
    static Map<String, Vibrate> vibrateMap = new HashMap<>();
    static {
        vibrateMap.put("impactLight", new VibrateWithDuration(new long[]{0, 20}));
        vibrateMap.put("impactMedium", new VibrateWithDuration(new long[]{0, 40}));
        vibrateMap.put("impactHeavy", new VibrateWithDuration(new long[]{0, 60}));
        vibrateMap.put("notificationSuccess", new VibrateWithDuration(new long[]{0, 40 ,60, 20}));
        vibrateMap.put("notificationWarning", new VibrateWithDuration(new long[]{0, 20, 60, 40}));
        vibrateMap.put("notificationError", new VibrateWithDuration(new long[]{0, 20, 40, 30, 40, 40}));
        vibrateMap.put("rigid", new VibrateWithDuration(new long[]{0, 30}));
        vibrateMap.put("soft", new VibrateWithDuration(new long[]{0, 10}));
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
}
