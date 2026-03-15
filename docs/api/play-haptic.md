# playHaptic()

Cross-platform haptic file playback. The recommended way to use AHAP files in a project that targets both iOS and Android.

## Signature

```ts
playHaptic(
  ahapFile: string,
  fallback: HapticEvent[],
  options?: HapticOptions,
): Promise<void>
```

## Parameters

| Parameter  | Type            | Description                          |
| ---------- | --------------- | ------------------------------------ |
| `ahapFile` | `string`        | AHAP file name to play on iOS        |
| `fallback` | `HapticEvent[]` | Pattern to play on Android           |
| `options`  | `HapticOptions` | Applied to the Android fallback path |

## Platform behaviour

| Platform | Action                                         |
| -------- | ---------------------------------------------- |
| iOS      | Calls `playAHAP(ahapFile)` — ignores `options` |
| Android  | Calls `triggerPattern(fallback, options)`      |

## Usage

```ts
import { playHaptic, pattern, Patterns } from "react-native-haptic-feedback";

// Using pattern notation for the fallback
await playHaptic("celebration.ahap", pattern("o.o.o.O"));

// Using a named preset as the fallback
await playHaptic("success.ahap", Patterns.success);

// With Android options
await playHaptic("alert.ahap", pattern("OO.OO"), {
  ignoreAndroidSystemSettings: true,
});
```

## With `useHaptics`

```ts
const haptics = useHaptics({ enableVibrateFallback: true });

// options are merged: defaultOptions + per-call opts
await haptics.playHaptic("celebration.ahap", pattern("o.o.o.O"));
```

## Kill switch

`playHaptic()` respects `setEnabled()`. If haptics are disabled it returns `Promise.resolve()` immediately.

## See also

- [`playAHAP()`](/api/play-ahap) — iOS-only lower-level method
- [`pattern()`](/api/pattern) — build a `HapticEvent[]` from notation
- [AHAP guide](/guide/ahap) — file format and Xcode setup
