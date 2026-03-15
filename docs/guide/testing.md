# Testing (Jest)

The library ships an official Jest auto-mock. All native methods are replaced with `jest.fn()` stubs so your tests run without a React Native environment.

## Setup

Add the module path to `moduleNameMapper` or `modulePathIgnorePatterns` in your Jest config:

```js
// jest.config.js
module.exports = {
  preset: "react-native",
  moduleNameMapper: {
    "react-native-haptic-feedback":
      "<rootDir>/node_modules/react-native-haptic-feedback/src/__mocks__/react-native-haptic-feedback",
  },
};
```

Or use the automatic mock resolution (works when your `moduleDirectories` includes `node_modules`):

```js
// jest.config.js
module.exports = {
  preset: "react-native",
  automock: false, // the mock is explicit, not automatic
  setupFilesAfterFramework: ["./setupTests.js"],
};
```

```js
// setupTests.js
jest.mock("react-native-haptic-feedback");
```

---

## What the mock provides

Every exported function is replaced with a `jest.fn()`. The mock covers:

| Export                  | Mock                                                                           |
| ----------------------- | ------------------------------------------------------------------------------ |
| `trigger`               | `jest.fn()`                                                                    |
| `stop`                  | `jest.fn()`                                                                    |
| `isSupported`           | `jest.fn(() => true)`                                                          |
| `triggerPattern`        | `jest.fn()`                                                                    |
| `playAHAP`              | `jest.fn(() => Promise.resolve())`                                             |
| `getSystemHapticStatus` | `jest.fn(() => Promise.resolve({ vibrationEnabled: true, ringerMode: null }))` |
| `setEnabled`            | `jest.fn()`                                                                    |
| `isEnabled`             | `jest.fn(() => true)`                                                          |
| `playHaptic`            | `jest.fn(() => Promise.resolve())`                                             |
| `useHaptics`            | Returns a stable object with all methods as `jest.fn()`                        |
| `pattern`               | Real implementation (pure JS, no native)                                       |
| `Patterns`              | Real implementation                                                            |

---

## Asserting haptic calls

```ts
import HapticFeedback from "react-native-haptic-feedback";

jest.mock("react-native-haptic-feedback");

test("plays success haptic on submit", () => {
  fireEvent.press(getByText("Submit"));

  expect(HapticFeedback.trigger).toHaveBeenCalledWith(
    "notificationSuccess",
    expect.any(Object),
  );
});
```

## Resetting between tests

```ts
beforeEach(() => {
  jest.clearAllMocks();
});
```

---

## Testing `useHaptics`

```ts
import { useHaptics } from "react-native-haptic-feedback";

jest.mock("react-native-haptic-feedback");

test("hook trigger is called", () => {
  const { result } = renderHook(() => useHaptics());
  act(() => result.current.trigger("impactLight"));
  expect(result.current.trigger).toHaveBeenCalledWith("impactLight");
});
```

---

## Testing `pattern()` (no mock needed)

`pattern()` is pure JavaScript. You can import and test it directly without any mocking:

```ts
import { pattern } from "react-native-haptic-feedback";

test("pattern generates correct events", () => {
  const events = pattern("oO");
  expect(events).toHaveLength(2);
  expect(events[0]).toMatchObject({ time: 0, intensity: 0.4 });
  expect(events[1]).toMatchObject({ time: 50, intensity: 1.0 });
});

test("pattern throws for invalid characters", () => {
  expect(() => pattern("oXO" as any)).toThrow(TypeError);
});
```
