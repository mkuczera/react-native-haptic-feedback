
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif

@interface RNReactNativeHapticFeedback : NSObject <RCTBridgeModule>

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
  
