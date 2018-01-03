
#import "RNReactNativeHapticFeedback.h"
#import <UIKit/UIKit.h>

@implementation RNReactNativeHapticFeedback

{
//   UIImpactFeedbackGenerator *_impactFeedback;
  UINotificationFeedbackGenerator *_notificationFeedback;
//   UISelectionFeedbackGenerator *_selectionFeedback;
}

- (void)setBridge:(RCTBridge *)bridge
{
  if ([UIFeedbackGenerator class]) {
    // _impactFeedback = [UIImpactFeedbackGenerator new];
    _notificationFeedback = [UINotificationFeedbackGenerator new];
    // _selectionFeedback = [UISelectionFeedbackGenerator new];
  }
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(trigger:(NSString *)type)
{
  switch trigger {
    case 'notificationError':
        [UINotificationFeedbackGenerator notificationOccurred:UINotificationFeedbackTypeError];
    case 'notificationWarning':
        [UINotificationFeedbackGenerator notificationWarning:UINotificationFeedbackTypeWarning];
    case 'notificationSuccess':
        [UINotificationFeedbackGenerator notificationOccurred:UINotificationFeedbackTypeSuccess];
    }
}

RCT_EXPORT_METHOD(prepare)
{
  [_impactFeedback prepare];
}

RCT_EXPORT_MODULE()

@end
