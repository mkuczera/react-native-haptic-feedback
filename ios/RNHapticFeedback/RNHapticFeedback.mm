#import "RNHapticFeedback.h"
#import <UIKit/UIKit.h>
#import <sys/utsname.h>
#import "DeviceUtils.h"
#import <AudioToolbox/AudioToolbox.h>
#import <AudioToolbox/AudioServices.h>

static UISelectionFeedbackGenerator *selectionGenerator = nil;
static NSMutableDictionary<NSString*, UIImpactFeedbackGenerator*> *impactGeneratorMap = nil;
static UINotificationFeedbackGenerator *notificationGenerator = nil;

@implementation RNHapticFeedback
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

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(trigger:(NSString *)type options:(JS::NativeHapticFeedback::SpecTriggerOptions&)options)
{
    BOOL enableVibrateFallback = options.enableVibrateFallback().value();
#else
RCT_EXPORT_METHOD(trigger:(NSString *)type options:(NSDictionary *)options)
{
    BOOL enableVibrateFallback = [[options objectForKey:@"enableVibrateFallback"] boolValue];
#endif

    if ([self supportsHaptic]){
        
        if ([type isEqual: @"impactLight"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleLight];
        } else if ([type isEqual:@"impactMedium"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleMedium];
        } else if ([type isEqual:@"impactHeavy"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleHeavy];
        } else if ([type isEqual:@"rigid"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleRigid];
        } else if ([type isEqual:@"soft"]) {
            [self generateImpactFeedback:UIImpactFeedbackStyleSoft];
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
        if ([type isEqual: @"impactMedium"]) {
            AudioServicesPlaySystemSound((SystemSoundID) 1520);
        } else if ([type isEqual:@"notificationWarning"]) {
            AudioServicesPlaySystemSound((SystemSoundID) 1521);
        } else {
            // Default selection haptic feedback
            AudioServicesPlaySystemSound((SystemSoundID) 1519);
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
    if (selectionGenerator == nil){
        selectionGenerator = [[UISelectionFeedbackGenerator alloc] init];
        [selectionGenerator prepare];
    }
    [selectionGenerator selectionChanged];
    [selectionGenerator prepare];
}

-(void)generateImpactFeedback:(UIImpactFeedbackStyle)style{
    NSString *key = [[NSNumber numberWithInteger: style] stringValue];
    if (impactGeneratorMap == nil)
        impactGeneratorMap = [[NSMutableDictionary alloc] init];
    if ([impactGeneratorMap objectForKey:key] == nil){
        [impactGeneratorMap setValue:[[UIImpactFeedbackGenerator alloc] initWithStyle:style] forKey:key];
        [[impactGeneratorMap objectForKey:key] prepare];
    }
    UIImpactFeedbackGenerator *generator = [impactGeneratorMap objectForKey:key];
    [generator impactOccurred];
    [generator prepare];
}

-(void)generateNotificationFeedback:(UINotificationFeedbackType)notificationType{
    if (notificationGenerator == nil){
        notificationGenerator = [[UINotificationFeedbackGenerator alloc] init];
        [notificationGenerator prepare];
    }
    [notificationGenerator notificationOccurred:notificationType];
    [notificationGenerator prepare];
}

// Thanks to this guard, we won't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule: (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeHapticFeedbackSpecJSI>(params);
}
#endif
    
@end
    
