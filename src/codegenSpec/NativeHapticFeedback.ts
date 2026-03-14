import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  trigger(
    type: string,
    options?: {
      enableVibrateFallback?: boolean;
      ignoreAndroidSystemSettings?: boolean;
    },
  ): void;
  stop(): void;
  isSupported(): boolean;
  triggerPattern(
    events: ReadonlyArray<{
      time: number;
      type?: string;
      duration?: number;
      intensity?: number;
      sharpness?: number;
    }>,
    options?: { enableVibrateFallback?: boolean; ignoreAndroidSystemSettings?: boolean },
  ): void;
  playAHAP(fileName: string): Promise<void>;
  getSystemHapticStatus(): Promise<object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNHapticFeedback");
