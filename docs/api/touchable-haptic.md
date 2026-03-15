# TouchableHaptic

A drop-in `Pressable` replacement that fires haptic feedback automatically. All standard `Pressable` props are forwarded.

## Import

```ts
import { TouchableHaptic } from "react-native-haptic-feedback";
import type { TouchableHapticProps } from "react-native-haptic-feedback";
```

## Props

Extends all `PressableProps` from React Native plus:

| Prop            | Type                                        | Default          | Description                      |
| --------------- | ------------------------------------------- | ---------------- | -------------------------------- |
| `hapticType`    | `HapticFeedbackTypes`                       | `'impactMedium'` | Which haptic to fire             |
| `hapticTrigger` | `'onPressIn' \| 'onPress' \| 'onLongPress'` | `'onPressIn'`    | When to fire the haptic          |
| `hapticOptions` | `HapticOptions`                             | —                | Options forwarded to `trigger()` |

All Pressable event handlers (`onPressIn`, `onPress`, `onLongPress`, etc.) still work and are called after the haptic fires.

## Usage

### Basic

```tsx
import { TouchableHaptic } from "react-native-haptic-feedback";

<TouchableHaptic onPress={handlePress}>
  <Text>Tap me</Text>
</TouchableHaptic>;
```

### Custom haptic type

```tsx
<TouchableHaptic
  hapticType="notificationSuccess"
  hapticTrigger="onPress"
  onPress={onSubmit}
>
  <Text>Submit</Text>
</TouchableHaptic>
```

### With styling

```tsx
<TouchableHaptic
  hapticType="impactLight"
  style={({ pressed }) => [styles.button, pressed && styles.pressed]}
  onPress={handlePress}
>
  <Text style={styles.label}>Press</Text>
</TouchableHaptic>
```

### Trigger on long press

```tsx
<TouchableHaptic
  hapticType="impactHeavy"
  hapticTrigger="onLongPress"
  onLongPress={handleLongPress}
>
  <Text>Hold me</Text>
</TouchableHaptic>
```

### With haptic options

```tsx
<TouchableHaptic
  hapticType="effectClick"
  hapticOptions={{ enableVibrateFallback: true }}
  onPress={handlePress}
>
  <Text>Click</Text>
</TouchableHaptic>
```

## TypeScript

```ts
import type { TouchableHapticProps } from 'react-native-haptic-feedback';

interface MyButtonProps extends TouchableHapticProps {
  label: string;
}

function MyButton({ label, ...props }: MyButtonProps) {
  return (
    <TouchableHaptic {...props}>
      <Text>{label}</Text>
    </TouchableHaptic>
  );
}
```

## Implementation note

`TouchableHaptic` wraps `Pressable` and injects haptic calls into `onPressIn`, `onPress`, and `onLongPress` via `useCallback`. The haptic fires first, then your supplied handler. The component does not introduce any additional re-renders.
