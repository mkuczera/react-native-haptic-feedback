# useHaptics hook

A React hook that provides all haptic methods with optional default options. Returns a **stable object** — methods only re-create when the option values actually change.

## Signature

```ts
function useHaptics(defaultOptions?: HapticOptions): HapticsAPI;
```

## Parameters

| Parameter        | Type            | Description                                              |
| ---------------- | --------------- | -------------------------------------------------------- |
| `defaultOptions` | `HapticOptions` | Options merged into every call that doesn't pass its own |

## Returns

An object with all haptic methods. Per-call options are merged on top of `defaultOptions`.

| Method                                  | Description                     |
| --------------------------------------- | ------------------------------- |
| `trigger(type, opts?)`                  | Fire a single haptic            |
| `triggerPattern(events, opts?)`         | Play a `HapticEvent[]` sequence |
| `stop()`                                | Stop ongoing haptics            |
| `isSupported()`                         | Device capability check         |
| `playHaptic(ahapFile, fallback, opts?)` | Cross-platform AHAP/pattern     |
| `setEnabled(value)`                     | Library-wide kill switch        |
| `isEnabled()`                           | Read kill-switch state          |
| `getSystemHapticStatus()`               | Query ringer/vibration state    |
| `playAHAP(fileName)`                    | Play AHAP file — iOS only       |

## Usage

### Basic

```ts
import { useHaptics } from 'react-native-haptic-feedback';

function MyComponent() {
  const haptics = useHaptics();

  return (
    <Pressable onPressIn={() => haptics.trigger('impactLight')}>
      <Text>Press me</Text>
    </Pressable>
  );
}
```

### With default options

```ts
const haptics = useHaptics({
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
});

// All calls automatically use the default options
haptics.trigger("impactMedium");

// Per-call options override defaults
haptics.trigger("impactHeavy", { ignoreAndroidSystemSettings: true });
```

### Shared hook instance

Create one instance at the top of your component and share it across handlers:

```ts
function CheckoutScreen() {
  const haptics = useHaptics({ enableVibrateFallback: true });

  const onAddItem = () => haptics.trigger("impactLight");
  const onCheckout = () => haptics.triggerPattern(Patterns.success);
  const onError = () => haptics.triggerPattern(Patterns.error);

  // ...
}
```

### With `playHaptic`

```ts
const haptics = useHaptics({ enableVibrateFallback: true });

await haptics.playHaptic("celebration.ahap", pattern("o.o.o.O"));
// defaultOptions are merged: { enableVibrateFallback: true, ...perCallOpts }
```

## Stability guarantee

The returned object is memoised with `useMemo`. It only re-creates when the individual option field values change — not when a new `HapticOptions` object reference is passed. This makes it safe to use in dependency arrays:

```ts
const haptics = useHaptics({ enableVibrateFallback: true });

useEffect(() => {
  haptics.trigger("impactMedium");
}, [haptics]); // ✓ stable — won't cause infinite loop
```

## See also

- [`TouchableHaptic`](/api/touchable-haptic) — Pressable component wrapper
- [`trigger()`](/api/trigger)
- [`triggerPattern()`](/api/trigger-pattern)
