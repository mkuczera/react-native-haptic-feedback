//
//  DeviceUtils.h
//  RNReactNativeHapticFeedback
//
//  Created by Michael Kuczera on 13.05.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DeviceUtils : NSObject;

+ (NSString *) platform;
+ (int)deviceVersion:(NSString*)deviceType;

@end;
