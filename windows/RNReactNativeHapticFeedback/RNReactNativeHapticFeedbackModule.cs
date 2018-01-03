using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace React.Native.Haptic.Feedback.RNReactNativeHapticFeedback
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNReactNativeHapticFeedbackModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNReactNativeHapticFeedbackModule"/>.
        /// </summary>
        internal RNReactNativeHapticFeedbackModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNReactNativeHapticFeedback";
            }
        }
    }
}
