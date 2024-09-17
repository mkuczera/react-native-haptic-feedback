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
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNHapticFeedback");
