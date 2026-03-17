# iOS — Core Haptics

## Engine

The library uses **`CHHapticEngine`** (Core Haptics) on all supported devices. UIKit feedback generators (`UIImpactFeedbackGenerator`, etc.) are no longer used.

### Initialisation & pre-warming

The engine is created eagerly at module init (inside `setBridge:`), so the first haptic call fires with no latency. If the engine is unavailable at init time it is created lazily on the first call instead. The engine restarts automatically via its `resetHandler`. You do not need to manage its lifecycle.

### Minimum iOS version

iOS **13.0** is required (Core Haptics availability). The library also compiles and links for older targets but will produce no output on devices below 13.0.

---

## Haptic types on iOS

| Type                  | Core Haptics mapping                     |
| --------------------- | ---------------------------------------- |
| `impactLight`         | Transient — intensity 0.5, sharpness 0.5 |
| `impactMedium`        | Transient — intensity 0.7, sharpness 0.5 |
| `impactHeavy`         | Transient — intensity 1.0, sharpness 0.5 |
| `rigid`               | Transient — intensity 1.0, sharpness 1.0 |
| `soft`                | Transient — intensity 0.5, sharpness 0.1 |
| `notificationSuccess` | Transient — intensity 0.8, sharpness 0.3 |
| `notificationWarning` | Transient — intensity 0.6, sharpness 0.6 |
| `notificationError`   | Transient — intensity 1.0, sharpness 0.8 |
| `selection`           | Transient — intensity 0.4, sharpness 0.3 |
| All others            | Mapped to a best-effort transient        |

---

## AHAP files

Apple Haptic and Audio Pattern (AHAP) files let you define complex, precisely-timed haptic and audio experiences. The library exposes two ways to use them.

### `playAHAP()` — iOS only

```ts
import HapticFeedback from "react-native-haptic-feedback";

// file must be placed in the iOS bundle (see below)
await HapticFeedback.playAHAP("celebration.ahap");
```

### `playHaptic()` — cross-platform

On iOS this calls `playAHAP`. On Android it plays the `fallback` pattern instead.

```ts
import { playHaptic, pattern } from "react-native-haptic-feedback";

await playHaptic("celebration.ahap", pattern("o.o.o.O"));
```

See the [AHAP guide](/guide/ahap) for file placement and format details.

---

## `enableVibrateFallback`

This option is a **no-op** on the Core Haptics path. Core Haptics already handles all supported devices internally. Setting it to `true` has no additional effect.

```ts
HapticFeedback.trigger("impactMedium", {
  enableVibrateFallback: true, // no-op on iOS — safe to pass for cross-platform code
});
```

---

## New Architecture (Turbo Modules)

The native module is implemented with `RCT_EXPORT_MODULE` and fully supports both Old Architecture and New Architecture (Turbo Modules). No Bridgeless configuration is needed.
