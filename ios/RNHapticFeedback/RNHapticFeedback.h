#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNHapticFeedbackSpec/RNHapticFeedbackSpec.h>

@interface RNHapticFeedback : NSObject <NativeHapticFeedbackSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RNHapticFeedback : NSObject <RCTBridgeModule>
#endif

@end
