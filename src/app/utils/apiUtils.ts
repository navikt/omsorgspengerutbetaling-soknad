import axios from 'axios';
import { axiosMultipartConfig } from '../config/axiosConfig';
import { ResourceType } from '../types/ResourceType';
import { getEnvironmentVariable } from './envUtils';

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, axiosMultipartConfig);
};

export const getApiUrlByResourceType = (resourceType: ResourceType) => {
    return `${getEnvironmentVariable('API_URL')}/${resourceType}`;
};
