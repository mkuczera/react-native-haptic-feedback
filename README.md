
# react-native-haptic-feedback

## Contributions welcome

Right now the Android implementation is a small Vibrate pattern, similar to the "feeling" of the iOS haptic system. Android needs to be View bound to trigger the real haptic engine.
So i want to enhance the Library to support a `<TouchableWithHapticFeedback>`. For iOS it's pretty simple to achieve this behaviour. If there are any recommendations for the Java part of this (trigger the haptic feedback and give support to all the options of a TouchableWithoutFeedback), feel free to make a PR :)

## Getting started

`$ npm install react-native-haptic-feedback --save`

or

`$ yarn add react-native-haptic-feedback`

### Linking

`$ react-native link react-native-haptic-feedback`
`$ cd ios && pod install`

### Or Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-haptic-feedback` and add `RNReactNativeHapticFeedback.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNReactNativeHapticFeedback.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`

- Add `import com.mkuczera.RNReactNativeHapticFeedbackPackage;` to the imports at the top of the file
- Add `new RNReactNativeHapticFeedbackPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-haptic-feedback'
   project(':react-native-haptic-feedback').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-haptic-feedback/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-haptic-feedback')
   ```

## Usage

```javascript
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

ReactNativeHapticFeedback.trigger("impactLight", options);
```

### Available methods

#### trigger(method, options)

| Argument                              | Description                                                                                                                                                             
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`                              | See methods below
| `options.enableVibrateFallback`       |  iOS only. if haptic feedback is not available (iOS < 10 OR Device < iPhone6s), vibrate with default method (heavy 1s) (default: false)                                                                                                                                                                                                                                                                                                                   |
| `options.ignoreAndroidSystemSettings` | Android only. if Haptic is disabled in the Android system settings this will allow ignoring the setting and trigger haptic feeback.  (default: false)                                                                                                                                                                                                                                                                                                     |                                     

### Method Overview

| Method | Android | iOS |
| :---: | :---: | :---: |
| impactLight | :heavy_check_mark: | :heavy_check_mark: |
| impactMedium | :heavy_check_mark: | :heavy_check_mark: |
| impactHeavy | :heavy_check_mark: | :heavy_check_mark: |
| rigid | :heavy_check_mark: | :heavy_check_mark: |
| soft | :heavy_check_mark: | :heavy_check_mark: |
| notificationSuccess | :heavy_check_mark: | :heavy_check_mark: |
| notificationWarning | :heavy_check_mark: | :heavy_check_mark: |
| notificationError | :heavy_check_mark: | :heavy_check_mark: |
| selection | | :heavy_check_mark: |
| clockTick | :heavy_check_mark: | |
| contextClick | :heavy_check_mark: | |
| keyboardPress | :heavy_check_mark: | |
| keyboardRelease | :heavy_check_mark: | |
| keyboardTap | :heavy_check_mark: | |
| longPress | :heavy_check_mark: | |
| textHandleMove | :heavy_check_mark: | |
| virtualKey | :heavy_check_mark: | |
| virtualKeyRelease | :heavy_check_mark: | |
| effectClick | :heavy_check_mark: | |
| effectDoubleClick | :heavy_check_mark: | |
| effectHeavyClick | :heavy_check_mark: | |
| effectTick | :heavy_check_mark: | |


### Available methods version 1.6.0 and prior

#### trigger(method, enableVibrateFallback)

| Argument                | Description                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`                | Possible values are "selection", "impactLight", "impactMedium", "impactHeavy", "notificationSuccess", "notificationWarning", "notificationError" (default: "selection") |
| `enableVibrateFallback` |  iOS only. if haptic feedback is not available (iOS < 10 OR Device < iPhone6s), vibrate with default method (heavy 1s)                                                  |
