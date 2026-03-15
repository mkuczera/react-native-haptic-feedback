# playAHAP()

Play an Apple Haptic and Audio Pattern (AHAP) file by name.

::: warning iOS only
`playAHAP` is an iOS-only method. On Android, it resolves immediately without doing anything. Use [`playHaptic()`](/api/play-haptic) for a cross-platform alternative.
:::

## Signature

```ts
playAHAP(fileName: string): Promise<void>
```

## Parameters

| Parameter  | Type     | Description                                                          |
| ---------- | -------- | -------------------------------------------------------------------- |
| `fileName` | `string` | File name (e.g. `'celebration.ahap'`) or path relative to the bundle |

## Usage

```ts
import HapticFeedback from "react-native-haptic-feedback";

await HapticFeedback.playAHAP("celebration.ahap");
```

## File placement

The engine searches `<bundle>/haptics/<name>` first, then `<bundle>/<name>`.

Place `.ahap` files in your Xcode project as a **folder reference** (blue folder, not yellow group):

```
ios/
└── YourApp/
    └── haptics/       ← add as folder reference in Xcode
        └── celebration.ahap
```

See the [AHAP guide](/guide/ahap) for detailed Xcode setup instructions and the full file format.

## Error handling

Native errors are caught internally. `playAHAP()` always resolves; it never rejects.

## Cross-platform usage

For apps targeting both iOS and Android, use `playHaptic()` which falls back to a `HapticEvent[]` pattern on Android:

```ts
import { playHaptic, pattern } from "react-native-haptic-feedback";

await playHaptic("celebration.ahap", pattern("o.o.o.O"));
//               ↑ iOS plays AHAP   ↑ Android plays this pattern
```
