
// This file now serves as a re-export for backward compatibility
// Import and re-export from the new modular context structure
import { useLms as useLmsFromModule } from "./lms/useLms";
import { LmsProvider as LmsProviderFromModule } from "./lms/LmsProvider";

export const LmsProvider = LmsProviderFromModule;
export const useLms = useLmsFromModule;
