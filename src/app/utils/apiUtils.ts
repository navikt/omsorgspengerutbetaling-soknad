import { ApiEndpoint } from '../types/ApiEndpoint';
import { getEnvironmentVariable } from './envUtils';

export const getApiUrlByResourceType = (resourceType: ApiEndpoint) => {
    return `${getEnvironmentVariable('FRONTEND_API_PATH')}/${resourceType}`;
};
