# trigger()

Fire a single haptic event.

## Signature

```ts
trigger(
  type: HapticFeedbackTypes | keyof typeof HapticFeedbackTypes,
  options?: HapticOptions,
): void
```

## Parameters

| Parameter | Type                  | Default       | Description             |
| --------- | --------------------- | ------------- | ----------------------- |
| `type`    | `HapticFeedbackTypes` | `'selection'` | The haptic type to play |
| `options` | `HapticOptions`       | `{}`          | Platform options        |

### HapticOptions

| Field                         | Type      | Default | Description                                                                          |
| ----------------------------- | --------- | ------- | ------------------------------------------------------------------------------------ |
| `enableVibrateFallback`       | `boolean` | `false` | No-op on iOS. On Android, plays a fallback vibration when haptics are not available. |
| `ignoreAndroidSystemSettings` | `boolean` | `false` | Android only. When `true`, plays haptics even in silent/vibrate mode.                |

## Usage

```ts
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";

// Using enum (recommended — autocomplete + type safety)
HapticFeedback.trigger(HapticFeedbackTypes.impactMedium);

// Using string literal
HapticFeedback.trigger("impactMedium");

// With options
HapticFeedback.trigger("notificationSuccess", {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
});
```

## Haptic type reference

### Impact

| Type           | Description         |
| -------------- | ------------------- |
| `impactLight`  | Light impact        |
| `impactMedium` | Medium impact       |
| `impactHeavy`  | Heavy impact        |
| `rigid`        | Rigid, sharp impact |
| `soft`         | Soft, dull impact   |

### Notification

| Type                  | Description          |
| --------------------- | -------------------- |
| `notificationSuccess` | Success notification |
| `notificationWarning` | Warning notification |
| `notificationError`   | Error notification   |

### Selection

| Type        | Description       |
| ----------- | ----------------- |
| `selection` | Selection changed |

### Keyboard / UI

| Type                | Platform | Description                 |
| ------------------- | -------- | --------------------------- |
| `clockTick`         | Both     | Clock tick                  |
| `contextClick`      | Android  | Context menu click          |
| `keyboardPress`     | Both     | Key press                   |
| `keyboardRelease`   | Both     | Key release                 |
| `keyboardTap`       | Both     | Key tap                     |
| `longPress`         | Both     | Long press                  |
| `textHandleMove`    | Both     | Text selection handle moved |
| `virtualKey`        | Both     | Virtual key press           |
| `virtualKeyRelease` | Both     | Virtual key release         |

### Android effects (API 29+)

| Type                | Description        |
| ------------------- | ------------------ |
| `effectClick`       | Standard click     |
| `effectDoubleClick` | Double click       |
| `effectHeavyClick`  | Heavy click        |
| `effectTick`        | Tick / light click |

### Android view haptics (API 30+)

| Type                  | Description           |
| --------------------- | --------------------- |
| `confirm`             | Confirm action        |
| `reject`              | Reject / cancel       |
| `gestureStart`        | Gesture started       |
| `gestureEnd`          | Gesture ended         |
| `segmentTick`         | Segment tick          |
| `segmentFrequentTick` | Frequent segment tick |
| `toggleOn`            | Toggle switched on    |
| `toggleOff`           | Toggle switched off   |

## Error handling

`trigger()` catches any native errors internally and logs them with `console.warn`. It will never throw.
