---
layout: home

hero:
  name: react-native-haptic-feedback
  text: Haptics that feel right
  tagline: Core Haptics, AHAP files, pattern notation, and cross-platform utilities for iOS and Android.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: Try on iOS
      link: https://apps.apple.com/us/app/haptic-feedback-tryout/id6760615313
    - theme: alt
      text: View on GitHub
      link: https://github.com/mkuczera/react-native-haptic-feedback

features:
  - icon: 🎯
    title: Simple by default
    details: One function call. Works on both platforms with sensible defaults — no configuration required.

  - icon: 🍎
    title: Core Haptics on iOS
    details: Uses CHHapticEngine for precise, expressive feedback on iOS 13+. AHAP file playback supported out of the box.

  - icon: 🤖
    title: Rich Android support
    details: Leverages VibrationEffect.Composition (API 31+), waveform effects (API 26+), and 8 view-based haptic constants (API 30+).

  - icon: 🎼
    title: Pattern notation
    details: Compose multi-event haptic sequences with a readable notation string — `oO.O`, `OO.OO`, `oO--oO` — with compile-time validation.

  - icon: ⚛️
    title: React-first APIs
    details: The `useHaptics` hook and `TouchableHaptic` component integrate naturally into any React Native component tree.

  - icon: 🧪
    title: First-class testing
    details: Official Jest auto-mock included. Drop-in support with no extra configuration.

  - icon: 📱
    title: Tryout App
    details: Test every haptic type on a real device. Available now on iOS — Android coming soon.
    link: https://apps.apple.com/us/app/haptic-feedback-tryout/id6760615313
    linkText: Download on the App Store
---

## Quick look

```ts
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";

// Single impact
HapticFeedback.trigger("impactMedium");

// Notification
HapticFeedback.trigger(HapticFeedbackTypes.notificationSuccess);
```

```ts
import { pattern, playHaptic } from "react-native-haptic-feedback";

// Cross-platform: AHAP on iOS, pattern fallback on Android
await playHaptic("celebration.ahap", pattern("o.o.o.O"));
```

```ts
import { useHaptics } from 'react-native-haptic-feedback';

function MyButton() {
  const haptics = useHaptics({ enableVibrateFallback: true });
  return <Pressable onPressIn={() => haptics.trigger('impactLight')} />;
}
```

## Installation

::: code-group

```sh [npm]
npm install react-native-haptic-feedback
```

```sh [yarn]
yarn add react-native-haptic-feedback
```

:::
