
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

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
  
