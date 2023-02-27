// Thanks to this guard, we won't import this header when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNHapticFeedbackSpec.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNHapticFeedback : NSObject <NativeHapticFeedbackSpec>
#else
@interface RNHapticFeedback : NSObject <RCTBridgeModule>
#endif

typedef enum {
    selection,
    impactLight,
    impactMedium,
    impactHeavy,
    rigid,
    soft,
    notificationSuccess,
    notificationWarning,
    notificationError
}FeedbackType;

- (Boolean)supportsHaptic;

@end
  
