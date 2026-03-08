import type { HybridObject } from 'react-native-nitro-modules';

export interface HapticFeedbackHybrid
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  trigger(
    type: string,
    options?: {
      enableVibrateFallback?: boolean;
      ignoreAndroidSystemSettings?: boolean;
    }
  ): void;

  stop(): void;

  isSupported(): boolean;

  triggerPattern(
    events: {
      time: number;
      type?: string;
      duration?: number;
      intensity?: number;
      sharpness?: number;
    }[],
    options?: {
      enableVibrateFallback?: boolean;
      ignoreAndroidSystemSettings?: boolean;
    }
  ): void;

  playAHAP(fileName: string): Promise<void>;

  getSystemHapticStatus(): Promise<{
    vibrationEnabled: boolean;
    ringerMode: string;
  }>;
}
