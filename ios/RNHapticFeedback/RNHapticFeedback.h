#ifdef RCT_NEW_ARCH_ENABLED
#import <RNHapticFeedbackSpec/RNHapticFeedbackSpec.h>

@interface RNHapticFeedback : NSObject <NativeHapticFeedbackSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RNHapticFeedback : NSObject <RCTBridgeModule>
#endif

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, FeedbackType) {
    selection,
    impactLight,
    impactMedium,
    impactHeavy,
    rigid,
    soft,
    notificationSuccess,
    notificationWarning,
    notificationError
};

- (Boolean)supportsHaptic;

@end
