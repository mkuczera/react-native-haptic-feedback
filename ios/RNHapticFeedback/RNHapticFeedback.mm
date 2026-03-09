#import "RNHapticFeedback.h"
#import <CoreHaptics/CoreHaptics.h>
#import <AudioToolbox/AudioToolbox.h>

API_AVAILABLE(ios(13.0))
@interface RNHapticFeedback()
@property (nonatomic, strong) CHHapticEngine *engine;
@property (nonatomic, strong) id<CHHapticPatternPlayer> hapticPlayer;
@end

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

// MARK: - Engine lifecycle

- (void)initEngine API_AVAILABLE(ios(13.0))
{
    if (_engine) return;

    NSError *error = nil;
    _engine = [[CHHapticEngine alloc] initAndReturnError:&error];
    if (error || !_engine) {
        _engine = nil;
        return;
    }

    __weak typeof(self) weakSelf = self;
    _engine.stoppedHandler = ^(CHHapticEngineStoppedReason reason) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf) {
            dispatch_async(dispatch_get_main_queue(), ^{
                strongSelf.engine = nil;
                strongSelf.hapticPlayer = nil;
            });
        }
    };

    _engine.resetHandler = ^{
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf) {
            dispatch_async(dispatch_get_main_queue(), ^{
                NSError *startError = nil;
                [strongSelf.engine startAndReturnError:&startError];
            });
        }
    };

    [_engine startAndReturnError:&error];
    if (error) {
        _engine = nil;
    }
}

// MARK: - Helpers

- (CHHapticEvent *)makeTransientEvent:(NSTimeInterval)time
                            intensity:(float)intensity
                            sharpness:(float)sharpness API_AVAILABLE(ios(13.0))
{
    CHHapticEventParameter *intensityParam = [[CHHapticEventParameter alloc]
        initWithParameterID:CHHapticEventParameterIDHapticIntensity
        value:intensity];
    CHHapticEventParameter *sharpnessParam = [[CHHapticEventParameter alloc]
        initWithParameterID:CHHapticEventParameterIDHapticSharpness
        value:sharpness];
    return [[CHHapticEvent alloc]
        initWithEventType:CHHapticEventTypeHapticTransient
        parameters:@[intensityParam, sharpnessParam]
        relativeTime:time];
}

- (NSArray<CHHapticEvent *> *)eventsForType:(NSString *)type API_AVAILABLE(ios(13.0))
{
    if ([type isEqual:@"impactLight"]) {
        return @[[self makeTransientEvent:0 intensity:0.3 sharpness:0.3]];
    } else if ([type isEqual:@"impactMedium"]) {
        return @[[self makeTransientEvent:0 intensity:0.6 sharpness:0.6]];
    } else if ([type isEqual:@"impactHeavy"]) {
        return @[[self makeTransientEvent:0 intensity:1.0 sharpness:0.8]];
    } else if ([type isEqual:@"rigid"]) {
        return @[[self makeTransientEvent:0 intensity:0.8 sharpness:1.0]];
    } else if ([type isEqual:@"soft"]) {
        return @[[self makeTransientEvent:0 intensity:0.3 sharpness:0.1]];
    } else if ([type isEqual:@"notificationSuccess"]) {
        return @[
            [self makeTransientEvent:0    intensity:0.4 sharpness:0.4],
            [self makeTransientEvent:0.1  intensity:0.8 sharpness:0.6],
        ];
    } else if ([type isEqual:@"notificationWarning"]) {
        return @[
            [self makeTransientEvent:0    intensity:0.6 sharpness:0.5],
            [self makeTransientEvent:0.15 intensity:0.8 sharpness:0.7],
        ];
    } else if ([type isEqual:@"notificationError"]) {
        return @[
            [self makeTransientEvent:0    intensity:1.0 sharpness:0.6],
            [self makeTransientEvent:0.1  intensity:0.6 sharpness:0.4],
            [self makeTransientEvent:0.2  intensity:0.8 sharpness:0.5],
        ];
    } else {
        // selection and any unrecognised type
        return @[[self makeTransientEvent:0 intensity:0.2 sharpness:0.5]];
    }
}

- (void)playEvents:(NSArray<CHHapticEvent *> *)events API_AVAILABLE(ios(13.0))
{
    [self initEngine];
    if (!_engine) return;

    NSError *error = nil;
    CHHapticPattern *pattern = [[CHHapticPattern alloc]
        initWithEvents:events parameters:@[] error:&error];
    if (error) return;

    id<CHHapticPatternPlayer> player = [_engine createPlayerWithPattern:pattern error:&error];
    if (error) return;

    _hapticPlayer = player;
    [player startAtTime:CHHapticTimeImmediate error:&error];
}

// MARK: - Exported methods

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(trigger:(NSString *)type options:(JS::NativeHapticFeedback::SpecTriggerOptions&)options)
{
    BOOL enableVibrateFallback = options.enableVibrateFallback().value();
#else
RCT_EXPORT_METHOD(trigger:(NSString *)type options:(NSDictionary *)options)
{
    BOOL enableVibrateFallback = [[options objectForKey:@"enableVibrateFallback"] boolValue];
#endif
    if (@available(iOS 13.0, *)) {
        if ([CHHapticEngine capabilitiesForHardware].supportsHaptics) {
            NSArray<CHHapticEvent *> *events = [self eventsForType:type];
            if (events) {
                [self playEvents:events];
                return;
            }
        }
    }
    if (enableVibrateFallback) {
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    }
}

RCT_EXPORT_METHOD(stop)
{
    if (@available(iOS 13.0, *)) {
        if (_hapticPlayer) {
            NSError *error = nil;
            [_hapticPlayer cancelAndReturnError:&error];
            _hapticPlayer = nil;
        }
        if (_engine) {
            [_engine stopWithCompletionHandler:nil];
            _engine = nil;
        }
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (BOOL)isSupported
{
    if (@available(iOS 13.0, *)) {
        return [CHHapticEngine capabilitiesForHardware].supportsHaptics;
    }
    return NO;
}
#else
RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, isSupported)
{
    if (@available(iOS 13.0, *)) {
        return @([CHHapticEngine capabilitiesForHardware].supportsHaptics);
    }
    return @NO;
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(triggerPattern:(NSArray *)events options:(JS::NativeHapticFeedback::SpecTriggerPatternOptions&)options)
{
    BOOL enableVibrateFallback = options.enableVibrateFallback().value();
#else
RCT_EXPORT_METHOD(triggerPattern:(NSArray *)events options:(NSDictionary *)options)
{
    BOOL enableVibrateFallback = [[options objectForKey:@"enableVibrateFallback"] boolValue];
#endif
    if (@available(iOS 13.0, *)) {
        if (![CHHapticEngine capabilitiesForHardware].supportsHaptics) {
            if (enableVibrateFallback) {
                AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
            }
            return;
        }

        NSMutableArray<CHHapticEvent *> *hapticEvents = [NSMutableArray array];
        for (NSDictionary *evt in events) {
            NSTimeInterval time = [evt[@"time"] doubleValue] / 1000.0;
            float intensity = evt[@"intensity"] ? [evt[@"intensity"] floatValue] : 0.5f;
            float sharpness = evt[@"sharpness"] ? [evt[@"sharpness"] floatValue] : 0.5f;
            NSString *type = evt[@"type"] ?: @"transient";

            CHHapticEventParameter *intensityParam = [[CHHapticEventParameter alloc]
                initWithParameterID:CHHapticEventParameterIDHapticIntensity value:intensity];
            CHHapticEventParameter *sharpnessParam = [[CHHapticEventParameter alloc]
                initWithParameterID:CHHapticEventParameterIDHapticSharpness value:sharpness];

            CHHapticEvent *hapticEvent;
            if ([type isEqual:@"continuous"]) {
                NSTimeInterval duration = evt[@"duration"] ? [evt[@"duration"] doubleValue] / 1000.0 : 0.1;
                hapticEvent = [[CHHapticEvent alloc]
                    initWithEventType:CHHapticEventTypeHapticContinuous
                    parameters:@[intensityParam, sharpnessParam]
                    relativeTime:time
                    duration:duration];
            } else {
                hapticEvent = [[CHHapticEvent alloc]
                    initWithEventType:CHHapticEventTypeHapticTransient
                    parameters:@[intensityParam, sharpnessParam]
                    relativeTime:time];
            }
            [hapticEvents addObject:hapticEvent];
        }

        if (hapticEvents.count > 0) {
            [self playEvents:hapticEvents];
        }
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(playAHAP:(NSString *)fileName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
#else
RCT_EXPORT_METHOD(playAHAP:(NSString *)fileName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
#endif
{
    if (@available(iOS 13.0, *)) {
        [self initEngine];
        if (!_engine) {
            reject(@"engine_unavailable", @"CHHapticEngine could not be initialised", nil);
            return;
        }

        // Search in <bundle>/haptics/ subdirectory first, then bundle root
        NSString *fullPath = [[NSBundle mainBundle] pathForResource:fileName
                                                             ofType:nil
                                                        inDirectory:@"haptics"];
        if (!fullPath) {
            fullPath = [[NSBundle mainBundle] pathForResource:fileName ofType:nil];
        }
        NSURL *fileURL = fullPath ? [NSURL fileURLWithPath:fullPath] : nil;

        if (!fileURL) {
            reject(@"file_not_found", [NSString stringWithFormat:@"AHAP file not found: %@", fileName], nil);
            return;
        }

        NSError *error = nil;
        [_engine playPatternFromURL:fileURL error:&error];
        if (error) {
            reject(@"playback_error", error.localizedDescription, error);
        } else {
            resolve(nil);
        }
    } else {
        resolve(nil);
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(getSystemHapticStatus:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
#else
RCT_EXPORT_METHOD(getSystemHapticStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
#endif
{
    BOOL vibrationEnabled = NO;
    if (@available(iOS 13.0, *)) {
        vibrationEnabled = [CHHapticEngine capabilitiesForHardware].supportsHaptics;
    }
    resolve(@{
        @"vibrationEnabled": @(vibrationEnabled),
        @"ringerMode": @"normal",
    });
}

// MARK: - New arch TurboModule

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeHapticFeedbackSpecJSI>(params);
}
#endif

@end
