# AHAP Files

Apple Haptic and Audio Pattern (AHAP) is a JSON-based format for defining complex haptic experiences on iOS. The library supports playing `.ahap` files at runtime and composing AHAP objects in TypeScript.

> AHAP is an **iOS-only** feature. Use [`playHaptic()`](/api/play-haptic) with a fallback pattern for cross-platform code.

---

## File placement

Place `.ahap` files in your iOS Xcode project and add them to the **app target** so they are included in the bundle.

### Recommended folder structure

```
ios/
└── YourApp/
    └── haptics/
        ├── celebration.ahap
        ├── heartbeat.ahap
        └── rumble.ahap
```

Add the `haptics/` folder as a **folder reference** (blue folder icon) in Xcode — not a group. This copies the directory structure into the bundle.

### Xcode step-by-step

1. Right-click your app target folder in Xcode → **Add Files to "YourApp"**
2. Select the `haptics/` folder
3. Choose **Create folder references** (not "Create groups")
4. Ensure **Add to targets** is checked for your app target

---

## Playing a file

```ts
import HapticFeedback from "react-native-haptic-feedback";

// plays ios/YourApp/haptics/celebration.ahap
await HapticFeedback.playAHAP("celebration.ahap");
```

The library searches `<bundle>/haptics/<name>` first, then `<bundle>/<name>`.

---

## Cross-platform wrapper

```ts
import { playHaptic, pattern } from "react-native-haptic-feedback";

// iOS → plays celebration.ahap
// Android → plays pattern('o.o.o.O') via triggerPattern
await playHaptic("celebration.ahap", pattern("o.o.o.O"));
```

---

## AHAP format

An AHAP file is valid JSON with a `Pattern` array of events and parameter curves.

### Minimal example

```json
{
  "Version": 1.0,
  "Pattern": [
    {
      "Event": {
        "EventType": "HapticTransient",
        "Time": 0.0,
        "EventParameters": [
          { "ParameterID": "HapticIntensity", "ParameterValue": 1.0 },
          { "ParameterID": "HapticSharpness", "ParameterValue": 0.8 }
        ]
      }
    },
    {
      "Event": {
        "EventType": "HapticTransient",
        "Time": 0.1,
        "EventParameters": [
          { "ParameterID": "HapticIntensity", "ParameterValue": 0.5 },
          { "ParameterID": "HapticSharpness", "ParameterValue": 0.3 }
        ]
      }
    }
  ]
}
```

### With a continuous event

```json
{
  "Event": {
    "EventType": "HapticContinuous",
    "Time": 0.0,
    "EventDuration": 0.5,
    "EventParameters": [
      { "ParameterID": "HapticIntensity", "ParameterValue": 0.6 },
      { "ParameterID": "HapticSharpness", "ParameterValue": 0.2 }
    ]
  }
}
```

### With a parameter curve (fade-out)

```json
{
  "ParameterCurve": {
    "ParameterID": "HapticIntensityControl",
    "Time": 0.0,
    "ParameterCurveControlPoints": [
      { "Time": 0.0, "ParameterValue": 1.0 },
      { "Time": 0.5, "ParameterValue": 0.0 }
    ]
  }
}
```

---

## TypeScript types

The library exports full TypeScript types for AHAP objects:

```ts
import type {
  AhapType,
  AhapEventPattern,
  AhapParameterCurvePattern,
} from "react-native-haptic-feedback";

const ahap: AhapType = {
  Version: 1.0,
  Pattern: [
    {
      Event: {
        EventType: "HapticTransient",
        Time: 0,
        EventParameters: [
          { ParameterID: "HapticIntensity", ParameterValue: 1.0 },
        ],
      },
    },
  ],
};
```

See the full [Types reference](/api/types#ahap-types-ios-only) for all AHAP-related interfaces.

---

## Resources

- [Apple — Representing Haptic Patterns in AHAP Files](https://developer.apple.com/documentation/corehaptics/representing_haptic_patterns_in_ahap_files)
- [Apple — Core Haptics](https://developer.apple.com/documentation/corehaptics)
- [AHAP Reference — Parameter IDs](https://developer.apple.com/documentation/corehaptics/chhapticeventparameter/parameterid)
