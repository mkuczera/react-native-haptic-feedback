# setEnabled() / isEnabled()

A library-wide kill switch for all haptic output. Useful for respecting an in-app "haptics" preference without threading the flag through every call site.

## setEnabled()

### Signature

```ts
setEnabled(value: boolean): void
```

Enable or disable all haptic feedback globally.

- **Default:** `true` (enabled)
- The setting is **in-memory only** — it resets to `true` on app restart. Persist it yourself (e.g. with `AsyncStorage` or `MMKV`) if you need it to survive restarts.

## isEnabled()

### Signature

```ts
isEnabled(): boolean
```

Returns the current enabled state.

---

## Usage

### Toggle based on a user preference

```ts
import HapticFeedback from 'react-native-haptic-feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';

// On app startup — restore preference
const saved = await AsyncStorage.getItem('haptics_enabled');
HapticFeedback.setEnabled(saved !== 'false');

// In settings screen
function HapticsToggle() {
  const [enabled, setEnabled] = useState(HapticFeedback.isEnabled());

  const toggle = async () => {
    const next = !enabled;
    HapticFeedback.setEnabled(next);
    setEnabled(next);
    await AsyncStorage.setItem('haptics_enabled', String(next));
  };

  return <Switch value={enabled} onValueChange={toggle} />;
}
```

### With `useHaptics`

```ts
import { useHaptics } from "react-native-haptic-feedback";

const haptics = useHaptics();

// All calls through haptics.trigger(), haptics.triggerPattern(), etc.
// automatically respect the global enabled state.
haptics.setEnabled(false);
haptics.trigger("impactMedium"); // no-op
```

---

## Behaviour

When `setEnabled(false)` is called:

- `trigger()` → returns immediately without firing
- `triggerPattern()` → returns immediately
- `stop()` → still runs (safe to call)
- `isSupported()` → still returns device capability (unaffected by kill switch)
- `playAHAP()` → returns `Promise.resolve()` immediately
- `playHaptic()` → returns `Promise.resolve()` immediately
