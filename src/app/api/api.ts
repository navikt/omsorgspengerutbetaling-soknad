import axios from 'axios';
import axiosConfig from '../config/axiosConfig';
import { OmsorgspengesøknadApiData } from '../types/OmsorgspengesøknadApiData';
import { ResourceType } from '../types/ResourceType';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';

export const getBarn = () => axios.get(getApiUrlByResourceType(ResourceType.BARN), axiosConfig);
export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);

export const sendApplication = (data: OmsorgspengesøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosConfig);
