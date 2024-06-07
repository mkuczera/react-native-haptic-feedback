# react-native-haptic-feedback

## Contributions Welcome

Thanks to all the amazing contributors for their support.

[![Contributors](https://contrib.rocks/image?repo=mkuczera/react-native-haptic-feedback)](https://github.com/mkuczera/react-native-haptic-feedback/graphs/contributors)

Made with [contrib.rocks](https://contrib.rocks).

## Getting Started

Install the `react-native-haptic-feedback` package using npm or yarn:

```bash
$ npm install react-native-haptic-feedback --save # or use $ yarn add react-native-haptic-feedback
```

## Linking

:information_source: **Note:** Starting from React Native version 0.60, native modules are auto-linked. For more details, refer to the [official documentation](https://facebook.github.io/react-native/blog/2019/07/03/version-60#native-modules-are-now-autolinked).

### Automatic Linking (React Native 0.60+)

For React Native 0.60 and above, manual linking is generally unnecessary. Auto-linking handles the process automatically.

### Manual Linking

If you're using an older React Native version or face issues with auto-linking, follow these manual linking steps:

1. Link the module:
   ```bash
   $ react-native link react-native-haptic-feedback
   ```
2. For iOS, navigate to the iOS directory and install CocoaPods dependencies:
   ```bash
   $ cd ios && pod install
   ```
   If you encounter issues with the previous step on iOS, clean up and reinstall the dependencies using these commands:
   ```bash
   $ rm -rf ios/Pods && rm -rf ios/build && cd ios && pod install && cd ../
   $ rm -rf node_modules && rm yarn.lock
   $ yarn install   # or use $ npm install
   ```
   
## Manual Setup Guide - iOS

1. **Open Your Project in Xcode:** Launch Xcode and navigate to your project in the project navigator.

2. **Add RNReactNativeHapticFeedback Project:** Right-click on the "Libraries" folder in the project navigator and select "Add Files to [your project's name]". Locate `RNReactNativeHapticFeedback.xcodeproj` in your project's `node_modules` directory and add it.

3. **Navigate to Project Settings:** In Xcode, select your project from the project navigator to access project settings.

4. **Select App Target:** Under the "Targets" section, choose the target corresponding to your app.

5. **Link Binary With Libraries:** Go to the "Build Phases" tab and expand the "Link Binary With Libraries" section.

6. **Add Library:** Click the "+" button to add a library.

7. **Add libRNReactNativeHapticFeedback.a:** From the list of libraries, select `libRNReactNativeHapticFeedback.a` and add it.

8. **Run Your Project:** Press `Cmd+R` to build and run your project in the iOS simulator or on a connected device.

## Manual Setup Guide - Android

1. **Configure MainApplication.java:** Open `android/app/src/main/java/[...]/MainApplication.java`.

   - Add the following import at the top of the file:
     ```java
     import com.mkuczera.RNReactNativeHapticFeedbackPackage;
     ```

2. **Modify settings.gradle:** Append the following lines to `android/settings.gradle`:
      ```gradle
      include ':react-native-haptic-feedback'
      project(':react-native-haptic-feedback').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-haptic-feedback/android')
      ```
## Usage

To use the library, import it in your JavaScript file:

```javascript
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Trigger haptic feedback
ReactNativeHapticFeedback.trigger("impactLight", options);
```

Alternatively, you can use the named import:

```javascript
import { trigger } from "react-native-haptic-feedback";

// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Trigger haptic feedback
trigger("impactLight", options);
```

## Available Methods

### `trigger(method, options)`

Use this method to trigger haptic feedback.

| Argument                              | Description                                                                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`                              | Specifies the type of haptic feedback. See the list of available methods below.                                                                     |
| `options.enableVibrateFallback`       | :iphone: iOS only. If haptic feedback is unavailable (iOS < 10 OR Device < iPhone6s), vibrate with default method (heavy 1s) (default: false).   |
| `options.ignoreAndroidSystemSettings` | :android: Android only. If haptic is disabled in the Android system settings, this allows ignoring the setting and triggering haptic feedback. (default: false). |

## Method Overview

Here's an overview of the available methods and their compatibility:

|       Method        |      Android       |        iOS         |
| :-----------------: | :----------------: | :----------------: |
|     impactLight     |   ✅   |   ✅   |
|    impactMedium     |   ✅   |   ✅   |
|     impactHeavy     |   ✅   |   ✅   |
|        rigid        |   ✅   |   ✅   |
|        soft         |   ✅   |   ✅   |
| notificationSuccess |   ✅   |   ✅   |
| notificationWarning |   ✅   |   ✅   |
|  notificationError  |   ✅   |   ✅   |
|      selection      |   ❌   |   ✅   |
|      clockTick      |   ✅   |   ❌   |
|    contextClick     |   ✅   |   ❌   |
|    keyboardPress    |   ✅   |   ❌   |
|   keyboardRelease   |   ✅   |   ❌   |
|     keyboardTap     |   ✅   |   ❌   |
|      longPress      |   ✅   |   ❌   |
|   textHandleMove    |   ✅   |   ❌   |
|     virtualKey      |   ✅   |   ❌   |
|  virtualKeyRelease  |   ✅   |   ❌   |
|     effectClick     |   ✅   |   ❌   |
|  effectDoubleClick  |   ✅   |   ❌   |
|  effectHeavyClick   |   ✅   |   ❌   |
|     effectTick      |   ✅   |   ❌   |

## Available Methods (Version 1.6.0 and Prior)

If you're using version 1.6.0 or earlier, you can use this method:

```javascript
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

// Trigger haptic feedback with vibrate fallback
ReactNativeHapticFeedback.trigger("method", enableVibrateFallback);
```

Where `method` can be one of: "selection", "impactLight", "impactMedium", "impactHeavy", "notificationSuccess", "notificationWarning", or "notificationError". The `enableVibrateFallback` option is for iOS devices without haptic feedback support.

We recommend using the newer approach for enhanced flexibility and improved compatibility.
