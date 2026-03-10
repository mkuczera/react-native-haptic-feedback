import RNHapticFeedback, {
  trigger,
  stop,
  isSupported,
  triggerPattern,
  playAHAP,
  getSystemHapticStatus,
} from "../index";
import { HapticFeedbackTypes, isRingerSilent } from "../types";
import { pattern } from "../utils/pattern";
import { Patterns } from "../presets";
import { useHaptics } from "../index";

const NativeHapticFeedbackMock = require("../codegenSpec/NativeHapticFeedback").default;

// ─── trigger ────────────────────────────────────────────────────────────────

describe("trigger", () => {
  it("calls native trigger with default options", () => {
    RNHapticFeedback.trigger(HapticFeedbackTypes.selection);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith("selection", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
  });

  it("calls native trigger with turbo module path", () => {
    trigger(HapticFeedbackTypes.selection);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith("selection", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
  });

  it("merges provided options over defaults", () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    };
    RNHapticFeedback.trigger(HapticFeedbackTypes.selection, options);

    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith("selection", options);
  });

  it("accepts a string type key", () => {
    RNHapticFeedback.trigger("impactHeavy");
    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith(
      "impactHeavy",
      expect.any(Object),
    );
  });
});

// ─── stop ────────────────────────────────────────────────────────────────────

describe("stop", () => {
  it("calls native stop", () => {
    RNHapticFeedback.stop();
    expect(NativeHapticFeedbackMock.stop).toHaveBeenCalled();
  });

  it("named export calls native stop", () => {
    stop();
    expect(NativeHapticFeedbackMock.stop).toHaveBeenCalled();
  });
});

// ─── isSupported ─────────────────────────────────────────────────────────────

describe("isSupported", () => {
  it("returns native value (true from mock)", () => {
    expect(RNHapticFeedback.isSupported()).toBe(true);
  });

  it("named export returns native value", () => {
    expect(isSupported()).toBe(true);
  });

  it("calls native isSupported", () => {
    RNHapticFeedback.isSupported();
    expect(NativeHapticFeedbackMock.isSupported).toHaveBeenCalled();
  });
});

// ─── triggerPattern ──────────────────────────────────────────────────────────

describe("triggerPattern", () => {
  it("calls native triggerPattern with events array", () => {
    const events = [{ time: 0, type: "transient" as const, intensity: 0.5, sharpness: 0.5 }];
    RNHapticFeedback.triggerPattern(events);
    expect(NativeHapticFeedbackMock.triggerPattern).toHaveBeenCalledWith(
      events,
      expect.objectContaining({ enableVibrateFallback: false }),
    );
  });

  it("named export calls native triggerPattern", () => {
    const events = [{ time: 100, type: "transient" as const, intensity: 1.0, sharpness: 0.8 }];
    triggerPattern(events, { enableVibrateFallback: true });
    expect(NativeHapticFeedbackMock.triggerPattern).toHaveBeenCalledWith(
      events,
      expect.objectContaining({ enableVibrateFallback: true }),
    );
  });
});

// ─── playAHAP ────────────────────────────────────────────────────────────────

describe("playAHAP", () => {
  it("calls native playAHAP with filename", async () => {
    await RNHapticFeedback.playAHAP("custom.ahap");
    expect(NativeHapticFeedbackMock.playAHAP).toHaveBeenCalledWith("custom.ahap");
  });

  it("named export resolves", async () => {
    await expect(playAHAP("test.ahap")).resolves.toBeUndefined();
  });
});

// ─── getSystemHapticStatus ───────────────────────────────────────────────────

describe("getSystemHapticStatus", () => {
  it("resolves with expected shape", async () => {
    const status = await RNHapticFeedback.getSystemHapticStatus();
    expect(status).toHaveProperty("vibrationEnabled");
    expect(status).toHaveProperty("ringerMode");
  });

  it("named export resolves with shape from mock", async () => {
    const status = await getSystemHapticStatus();
    expect(status.vibrationEnabled).toBe(true);
    expect(status.ringerMode).toBe("normal");
  });
});

// ─── pattern utility ─────────────────────────────────────────────────────────

describe("pattern()", () => {
  it("empty string returns empty array", () => {
    expect(pattern("")).toEqual([]);
  });

  it("'o' produces a soft transient at time 0", () => {
    const [evt] = pattern("o");
    expect(evt).toMatchObject({ time: 0, type: "transient", intensity: 0.4, sharpness: 0.4 });
  });

  it("'O' produces a strong transient at time 0", () => {
    const [evt] = pattern("O");
    expect(evt).toMatchObject({ time: 0, type: "transient", intensity: 1.0, sharpness: 0.8 });
  });

  it("'.' advances cursor by 100ms", () => {
    const events = pattern(".O");
    expect(events[0]!.time).toBe(100);
  });

  it("'-' advances cursor by 300ms", () => {
    const events = pattern("-O");
    expect(events[0]!.time).toBe(300);
  });

  it("'=' advances cursor by 1000ms", () => {
    const events = pattern("=O");
    expect(events[0]!.time).toBe(1000);
  });

  it("'oO.O' produces 3 events with correct times", () => {
    const events = pattern("oO.O");
    expect(events).toHaveLength(3);
    expect(events[0]!.time).toBe(0);
    expect(events[1]!.time).toBe(0);
    expect(events[2]!.time).toBe(100);
  });

  it("throws TypeError for unknown characters", () => {
    // Cast to string to bypass compile-time check — we're testing runtime behaviour
    expect(() => pattern("x?!" as string)).toThrow(TypeError);
    expect(() => pattern("x?!" as string)).toThrow(/invalid character/);
  });

  it("combined gaps accumulate", () => {
    const events = pattern(".-O"); // 100 + 300 = 400
    expect(events[0]!.time).toBe(400);
  });
});

// ─── Patterns presets ────────────────────────────────────────────────────────

describe("Patterns presets", () => {
  it("all presets are non-empty arrays", () => {
    for (const [, events] of Object.entries(Patterns)) {
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      // Each event has at minimum a 'time' property
      for (const evt of events) {
        expect(typeof evt.time).toBe("number");
      }
    }
  });

  it("success preset has correct shape", () => {
    const events = Patterns.success!;
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty("time");
    expect(events[0]).toHaveProperty("intensity");
  });
});

// ─── useHaptics hook ─────────────────────────────────────────────────────────

describe("useHaptics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("trigger passes type to RNHapticFeedback.trigger", () => {
    const haptics = useHaptics();
    haptics.trigger(HapticFeedbackTypes.impactMedium);
    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith(
      "impactMedium",
      expect.any(Object),
    );
  });

  it("merges defaultOptions into trigger call", () => {
    const haptics = useHaptics({ enableVibrateFallback: true });
    haptics.trigger(HapticFeedbackTypes.impactLight);
    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith(
      "impactLight",
      expect.objectContaining({ enableVibrateFallback: true }),
    );
  });

  it("per-call options override defaultOptions", () => {
    const haptics = useHaptics({ enableVibrateFallback: true });
    haptics.trigger(HapticFeedbackTypes.impactHeavy, { enableVibrateFallback: false });
    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalledWith(
      "impactHeavy",
      expect.objectContaining({ enableVibrateFallback: false }),
    );
  });

  it("stop() calls RNHapticFeedback.stop", () => {
    const haptics = useHaptics();
    haptics.stop();
    expect(NativeHapticFeedbackMock.stop).toHaveBeenCalled();
  });

  it("isSupported() returns native value", () => {
    const haptics = useHaptics();
    expect(haptics.isSupported()).toBe(true);
  });

  it("triggerPattern passes events and merged options", () => {
    const haptics = useHaptics({ enableVibrateFallback: true });
    const events = pattern("oO");
    haptics.triggerPattern(events);
    expect(NativeHapticFeedbackMock.triggerPattern).toHaveBeenCalledWith(
      events,
      expect.objectContaining({ enableVibrateFallback: true }),
    );
  });

  it("exposes setEnabled and isEnabled", () => {
    const haptics = useHaptics();
    expect(typeof haptics.setEnabled).toBe("function");
    expect(typeof haptics.isEnabled).toBe("function");
  });

  it("exposes getSystemHapticStatus", () => {
    const haptics = useHaptics();
    expect(typeof haptics.getSystemHapticStatus).toBe("function");
  });

  it("exposes playAHAP", () => {
    const haptics = useHaptics();
    expect(typeof haptics.playAHAP).toBe("function");
  });
});

// ─── setEnabled / isEnabled ──────────────────────────────────────────────────

describe("setEnabled / isEnabled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RNHapticFeedback.setEnabled(true);
  });

  afterEach(() => {
    RNHapticFeedback.setEnabled(true);
  });

  it("isEnabled() returns true by default", () => {
    expect(RNHapticFeedback.isEnabled()).toBe(true);
  });

  it("setEnabled(false) makes isEnabled() return false", () => {
    RNHapticFeedback.setEnabled(false);
    expect(RNHapticFeedback.isEnabled()).toBe(false);
  });

  it("setEnabled(true) re-enables after disable", () => {
    RNHapticFeedback.setEnabled(false);
    RNHapticFeedback.setEnabled(true);
    expect(RNHapticFeedback.isEnabled()).toBe(true);
  });

  it("trigger skips native when disabled", () => {
    RNHapticFeedback.setEnabled(false);
    RNHapticFeedback.trigger("impactMedium");
    expect(NativeHapticFeedbackMock.trigger).not.toHaveBeenCalled();
  });

  it("triggerPattern skips native when disabled", () => {
    RNHapticFeedback.setEnabled(false);
    RNHapticFeedback.triggerPattern([{ time: 0, type: "transient" as const, intensity: 0.5, sharpness: 0.5 }]);
    expect(NativeHapticFeedbackMock.triggerPattern).not.toHaveBeenCalled();
  });

  it("playAHAP skips native when disabled", async () => {
    RNHapticFeedback.setEnabled(false);
    await RNHapticFeedback.playAHAP("test.ahap");
    expect(NativeHapticFeedbackMock.playAHAP).not.toHaveBeenCalled();
  });

  it("trigger resumes after re-enabling", () => {
    RNHapticFeedback.setEnabled(false);
    RNHapticFeedback.setEnabled(true);
    RNHapticFeedback.trigger("impactMedium");
    expect(NativeHapticFeedbackMock.trigger).toHaveBeenCalled();
  });
});

// ─── error handling (native throws) ─────────────────────────────────────────

describe("hapticFeedback error handling", () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it("trigger catches native errors silently", () => {
    NativeHapticFeedbackMock.trigger.mockImplementationOnce(() => { throw new Error("native unavailable"); });
    expect(() => RNHapticFeedback.trigger("impactMedium")).not.toThrow();
  });

  it("stop catches native errors silently", () => {
    NativeHapticFeedbackMock.stop.mockImplementationOnce(() => { throw new Error("native unavailable"); });
    expect(() => RNHapticFeedback.stop()).not.toThrow();
  });

  it("isSupported returns false when native throws", () => {
    NativeHapticFeedbackMock.isSupported.mockImplementationOnce(() => { throw new Error("native unavailable"); });
    expect(RNHapticFeedback.isSupported()).toBe(false);
  });

  it("triggerPattern catches native errors silently", () => {
    NativeHapticFeedbackMock.triggerPattern.mockImplementationOnce(() => { throw new Error("native unavailable"); });
    expect(() => RNHapticFeedback.triggerPattern([])).not.toThrow();
  });

  it("playAHAP resolves (does not reject) when native throws", async () => {
    NativeHapticFeedbackMock.playAHAP.mockImplementationOnce(() => { throw new Error("native unavailable"); });
    await expect(RNHapticFeedback.playAHAP("test.ahap")).resolves.toBeUndefined();
  });

  it("getSystemHapticStatus returns fallback when native rejects", async () => {
    NativeHapticFeedbackMock.getSystemHapticStatus.mockRejectedValueOnce(new Error("native unavailable"));
    const status = await RNHapticFeedback.getSystemHapticStatus();
    expect(status).toEqual({ vibrationEnabled: false, ringerMode: null });
  });
});

// ─── pattern() position bug ──────────────────────────────────────────────────

describe("pattern() error position", () => {
  it("reports the correct position of the first invalid char", () => {
    try {
      pattern("oox" as string);
    } catch (e) {
      expect((e as TypeError).message).toMatch(/position 2/);
    }
  });

  it("reports the correct position when invalid char appears twice (second occurrence)", () => {
    try {
      pattern("oxo" as string);
    } catch (e) {
      // 'x' is at index 1, not 0
      expect((e as TypeError).message).toMatch(/position 1/);
    }
  });
});

// ─── isRingerSilent ───────────────────────────────────────────────────────────

describe("isRingerSilent", () => {
  it("returns false when ringerMode is null (iOS)", () => {
    expect(isRingerSilent({ vibrationEnabled: true, ringerMode: null })).toBe(false);
  });

  it("returns true when ringerMode is 'silent' (Android)", () => {
    expect(isRingerSilent({ vibrationEnabled: false, ringerMode: 'silent' })).toBe(true);
  });

  it("returns false when ringerMode is 'vibrate'", () => {
    expect(isRingerSilent({ vibrationEnabled: true, ringerMode: 'vibrate' })).toBe(false);
  });

  it("returns false when ringerMode is 'normal'", () => {
    expect(isRingerSilent({ vibrationEnabled: true, ringerMode: 'normal' })).toBe(false);
  });
});

