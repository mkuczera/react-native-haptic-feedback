//
//  RNHapticFeedbackSpec.h
//  RNHapticFeedback
//
//  Created by Michael Kuczera on 05.08.24.
//  Copyright © 2024 Facebook. All rights reserved.
//
#import <Foundation/Foundation.h>

@protocol NativeHapticFeedbackSpec <NSObject>

// Indicates whether the device supports haptic feedback
- (Boolean)supportsHaptic;

@end
