import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];

export const appIsRunningInDevEnvironment = () => process.env.NODE_ENV === 'development';

export const appIsRunningInDemoMode = () => isFeatureEnabled(Feature.DEMO_MODE);

export const enableDemoModeUpload = () => isFeatureEnabled(Feature.DEMO_MOVE_ENABLE_UPLOAD);
