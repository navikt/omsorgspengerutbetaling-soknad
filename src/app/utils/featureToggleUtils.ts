export enum Feature {
    'STENGT_BHG_SKOLE' = 'STENGT_BHG_SKOLE',
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'MELLOMLAGRING' = 'MELLOMLAGRING',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
