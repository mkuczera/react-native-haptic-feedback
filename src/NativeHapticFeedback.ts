import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // your module methods go here, for example:
  trigger(
    type: string,
    options?: {
      enableVibrateFallback?: boolean;
      ignoreAndroidSystemSettings?: boolean;
    },
  ): void;
}
export default TurboModuleRegistry.get<Spec>("RNHapticFeedback");
