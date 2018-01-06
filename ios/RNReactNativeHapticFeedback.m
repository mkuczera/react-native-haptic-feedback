
#import "RNReactNativeHapticFeedback.h"
#import <UIKit/UIKit.h>

@implementation RNReactNativeHapticFeedback

{
    UIImpactFeedbackGenerator *_impactFeedback;
    UINotificationFeedbackGenerator *_notificationFeedback;
    UISelectionFeedbackGenerator *_selectionFeedback;
}

@synthesize bridge = _bridge;

- (void)setBridge:(RCTBridge *)bridge
{
  if ([UIFeedbackGenerator class]) {
    _impactFeedback = [UIImpactFeedbackGenerator new];
    _notificationFeedback = [UINotificationFeedbackGenerator new];
    _selectionFeedback = [UISelectionFeedbackGenerator new];
  }
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(trigger:(NSString *)type)
{
    [_notificationFeedback notificationOccurred:UINotificationFeedbackTypeWarning];
}


@end
