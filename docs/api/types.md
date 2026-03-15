# Types

All types are re-exported from the package root and can be imported directly:

```ts
import type {
  HapticOptions,
  HapticEvent,
  SystemHapticStatus,
  PatternChar,
  PatternName,
  AhapType,
  // ...
} from "react-native-haptic-feedback";
```

---

## HapticFeedbackTypes

Enum of all available haptic feedback types.

```ts
enum HapticFeedbackTypes {
  selection = "selection",
  impactLight = "impactLight",
  impactMedium = "impactMedium",
  impactHeavy = "impactHeavy",
  rigid = "rigid",
  soft = "soft",
  notificationSuccess = "notificationSuccess",
  notificationWarning = "notificationWarning",
  notificationError = "notificationError",
  clockTick = "clockTick",
  contextClick = "contextClick",
  keyboardPress = "keyboardPress",
  keyboardRelease = "keyboardRelease",
  keyboardTap = "keyboardTap",
  longPress = "longPress",
  textHandleMove = "textHandleMove",
  virtualKey = "virtualKey",
  virtualKeyRelease = "virtualKeyRelease",
  effectClick = "effectClick",
  effectDoubleClick = "effectDoubleClick",
  effectHeavyClick = "effectHeavyClick",
  effectTick = "effectTick",
  confirm = "confirm",
  reject = "reject",
  gestureStart = "gestureStart",
  gestureEnd = "gestureEnd",
  segmentTick = "segmentTick",
  segmentFrequentTick = "segmentFrequentTick",
  toggleOn = "toggleOn",
  toggleOff = "toggleOff",
}
```

All methods that accept a haptic type also accept the string literal equivalent, so `'impactMedium'` and `HapticFeedbackTypes.impactMedium` are interchangeable.

---

## HapticOptions

Options accepted by `trigger()`, `triggerPattern()`, and `playHaptic()`.

```ts
interface HapticOptions {
  enableVibrateFallback?: boolean;
  ignoreAndroidSystemSettings?: boolean;
}
```

| Field                         | Default | Description                                                                              |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `enableVibrateFallback`       | `false` | No-op on iOS. On Android, plays a basic vibration fallback when haptics are unavailable. |
| `ignoreAndroidSystemSettings` | `false` | Android only. When `true`, haptics play even in silent/vibrate mode.                     |

---

## HapticEvent

A single timed event in a haptic pattern sequence.

```ts
interface HapticEvent {
  /** Offset from pattern start in milliseconds */
  time: number;
  type?: "transient" | "continuous";
  /** Duration in ms — only for continuous events */
  duration?: number;
  /** 0.0–1.0 */
  intensity?: number;
  /** 0.0–1.0 */
  sharpness?: number;
}
```

---

## SystemHapticStatus

Result of `getSystemHapticStatus()`.

```ts
interface SystemHapticStatus {
  vibrationEnabled: boolean;
  ringerMode: "silent" | "vibrate" | "normal" | null;
}
```

| Field              | iOS                                   | Android                                             |
| ------------------ | ------------------------------------- | --------------------------------------------------- |
| `vibrationEnabled` | `true` when Core Haptics is supported | `true` when device has a vibrator and is not silent |
| `ringerMode`       | Always `null`                         | `'silent'`, `'vibrate'`, or `'normal'`              |

### isRingerSilent()

```ts
function isRingerSilent(status: SystemHapticStatus): boolean;
```

Returns `true` only when `status.ringerMode === 'silent'`. On iOS always returns `false`.

---

## PatternChar

```ts
type PatternChar = "o" | "O" | "." | "-" | "=";
```

The union of characters accepted by `pattern()`. See the [Pattern Notation guide](/guide/pattern).

---

## AssertValidPattern

A conditional type that validates pattern strings at compile time:

```ts
type AssertValidPattern<S extends string> = string extends S
  ? S // runtime variable — passes through
  : IsValidPattern<S> extends true
    ? S // valid literal — passes through
    : never; // invalid literal — type error
```

---

## AHAP types (iOS only)

> These types are exported for use when constructing AHAP objects in TypeScript. They are only relevant on iOS.

### AhapEventParameterID

```ts
type AhapEventParameterID =
  | "HapticIntensity"
  | "HapticSharpness"
  | "AttackTime"
  | "DecayTime"
  | "ReleaseTime"
  | "Sustained"
  | "AudioVolume"
  | "AudioPitch"
  | "AudioPan"
  | "AudioBrightness";
```

### AhapDynamicParameterID

```ts
type AhapDynamicParameterID =
  | "HapticIntensityControl"
  | "HapticSharpnessControl"
  | "HapticAttackTimeControl"
  | "HapticDecayTimeControl"
  | "HapticReleaseTimeControl"
  | "AudioVolumeControl"
  | "AudioPanControl"
  | "AudioBrightnessControl"
  | "AudioPitchControl"
  | "AudioAttackTimeControl"
  | "AudioDecayTimeControl"
  | "AudioReleaseTimeControl";
```

### AhapType

The top-level AHAP document structure:

```ts
interface AhapType {
  Version?: 1.0;
  Metadata?: {
    Project?: string;
    Created?: string;
    Description?: string;
  };
  Pattern: (AhapEventPattern | AhapParameterCurvePattern)[];
}
```

See the [AHAP guide](/guide/ahap) for complete examples.
