# getSystemHapticStatus()

Query the device's current vibration and ringer state.

## Signature

```ts
getSystemHapticStatus(): Promise<SystemHapticStatus>
```

## Returns

```ts
interface SystemHapticStatus {
  /** true if the device has a vibrator and is not in silent mode */
  vibrationEnabled: boolean;
  /** Android: current ringer mode. iOS: always null. */
  ringerMode: "silent" | "vibrate" | "normal" | null;
}
```

| Field              | iOS                                | Android                                                   |
| ------------------ | ---------------------------------- | --------------------------------------------------------- |
| `vibrationEnabled` | `true` when haptics are supported  | `true` when device has vibrator and is not in silent mode |
| `ringerMode`       | Always `null` (not exposed by iOS) | `'silent'`, `'vibrate'`, or `'normal'`                    |

## Usage

```ts
import HapticFeedback, { isRingerSilent } from "react-native-haptic-feedback";

const status = await HapticFeedback.getSystemHapticStatus();

console.log(status.vibrationEnabled); // true / false
console.log(status.ringerMode); // 'normal' | 'vibrate' | 'silent' | null
```

### Check silent mode (Android)

```ts
import {
  getSystemHapticStatus,
  isRingerSilent,
} from "react-native-haptic-feedback";

const status = await getSystemHapticStatus();

if (isRingerSilent(status)) {
  // Phone is in silent mode on Android
  // On iOS this always returns false
}
```

### Show a status badge in your UI

```ts
function HapticStatusBadge() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getSystemHapticStatus().then(setStatus);
  }, []);

  if (!status) return null;

  return (
    <Text>
      {status.vibrationEnabled ? 'Haptics ON' : 'Haptics OFF'}
      {status.ringerMode ? ` · ${status.ringerMode}` : ''}
    </Text>
  );
}
```

## isRingerSilent()

A small helper that returns `true` only when `ringerMode === 'silent'`:

```ts
function isRingerSilent(status: SystemHapticStatus): boolean;
```

On iOS, `ringerMode` is always `null`, so this always returns `false`. Treat iOS silence as _unknown_, not _silent_.
