
#import "RNReactNativeHapticFeedback.h"
#import <UIKit/UIKit.h>

@implementation RNReactNativeHapticFeedback
@synthesize bridge = _bridge;

- (void)setBridge:(RCTBridge *)bridge
{
    _bridge = bridge;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(trigger:(FeedbackType)type)
{
    if (![self supportsHaptic]){
        return;
    }
    
    switch (type) {
        case impactLight:
            [self generateImpactFeedback:UIImpactFeedbackStyleLight];
            break;
        case impactMedium:
            [self generateImpactFeedback:UIImpactFeedbackStyleMedium];
            break;
        case impactHeavy:
            [self generateImpactFeedback:UIImpactFeedbackStyleHeavy];
            break;
        case notificationSuccess:
            [self generateNotificationFeedback:UINotificationFeedbackTypeSuccess];
            break;
        case notificationWarning:
            [self generateNotificationFeedback:UINotificationFeedbackTypeWarning];
            break;
        case notificationError:
            [self generateNotificationFeedback:UINotificationFeedbackTypeError];
            break;
        default:
            [self generateSelectionFeedback];
            break;
    }
}

-(Boolean)supportsHaptic {
    return [[UIDevice currentDevice] systemVersion].floatValue < 10.0;
}

-(void)generateSelectionFeedback{
    UISelectionFeedbackGenerator *generator = [[UISelectionFeedbackGenerator alloc] init];
    [generator prepare];
    [generator selectionChanged];
    generator = nil;
}

-(void)generateImpactFeedback:(UIImpactFeedbackStyle)style{
    UIImpactFeedbackGenerator *generator = [[UIImpactFeedbackGenerator alloc] initWithStyle:style];
    [generator prepare];
    [generator impactOccurred];
    generator = nil;
}

-(void)generateNotificationFeedback:(UINotificationFeedbackType)notificationType{
    UINotificationFeedbackGenerator *generator = [[UINotificationFeedbackGenerator alloc] init];
    [generator prepare];
    [generator notificationOccurred:notificationType];
    generator = nil;
}


@end
