
#import "RNReactNativeHapticFeedback.h"
#import <UIKit/UIKit.h>
#import <sys/utsname.h>
#import "DeviceUtils.h"
#import <AudioToolbox/AudioToolbox.h>
#import <AudioToolbox/AudioServices.h>

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

RCT_EXPORT_METHOD(trigger:(NSString *)type options:(NSDictionary *)options)
{
    BOOL enableVibrateFallback = [[options objectForKey:@"enableVibrateFallback"]boolValue];
    
    if ([self supportsHaptic]){
        
        if ([type isEqual: @"impactLight"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleLight];
        } else if ([type isEqual:@"impactMedium"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleMedium];
        } else if ([type isEqual:@"impactHeavy"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleHeavy];
        } else if ([type isEqual:@"notificationSuccess"]) {
            [self generateNotificationFeedback:UINotificationFeedbackTypeSuccess];
        } else if ([type isEqual:@"notificationWarning"]) {
            [self generateNotificationFeedback:UINotificationFeedbackTypeWarning];
        } else if ([type isEqual:@"notificationError"]) {
            [self generateNotificationFeedback:UINotificationFeedbackTypeError];
        } else {
            [self generateSelectionFeedback];
        }
        
    } else if ([self supportsHapticFor6SAnd6SPlus]) {
        
        // generates alternative haptic feedback
        if ([type isEqual: @"selection"]) {
            AudioServicesPlaySystemSound((SystemSoundID) 1519);
        } else if ([type isEqual: @"impactMedium"]) {
            AudioServicesPlaySystemSound((SystemSoundID) 1520);
        } else if ([type isEqual:@"notificationWarning"]) {
            AudioServicesPlaySystemSound((SystemSoundID) 1521);
        }
        
    } else if (enableVibrateFallback) {
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    }
    
}

-(Boolean)supportsHaptic {
    return [[UIDevice currentDevice] systemVersion].floatValue >= 10.0
        && [DeviceUtils deviceVersion:@"iPhone"] > 8;
}

-(Boolean)supportsHapticFor6SAnd6SPlus {
    return [[UIDevice currentDevice] systemVersion].floatValue >= 10.0
        && ([[DeviceUtils platform] isEqualToString:@"iPhone8,1"]  // iPhone 6S
        || [[DeviceUtils platform] isEqualToString:@"iPhone8,2"]); // iPhone 6S Plus
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
