
#import "RNReactNativeHapticFeedback.h"
#import <UIKit/UIKit.h>

@implementation RNReactNativeHapticFeedback

{
  UIImpactFeedbackGenerator *_impactFeedback;
  UINotificationFeedbackGenerator *_notificationFeedback;
  UISelectionFeedbackGenerator *_selectionFeedback;
}
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
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

RCT_EXPORT_METHOD(trigger:(NSString *)type)
{
  if ([type isEqual: @"impact"]) {
    [_impactFeedback impactOccurred];
  } else if ([type isEqual:@"notification"]) {
    [_notificationFeedback notificationOccurred:UINotificationFeedbackTypeWarning];
  } else if ([type isEqual:@"selection"]) {
    [_selectionFeedback selectionChanged];
  } else {
    [_impactFeedback impactOccurred];
  }
}

RCT_EXPORT_METHOD(prepare)
{
  // Only calling prepare on one generator, it's sole purpose is to awake the taptic engine
  [_impactFeedback prepare];
}

@end
