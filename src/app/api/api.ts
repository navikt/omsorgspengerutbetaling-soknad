import axios from 'axios';
import { axiosJsonConfig } from '../config/axiosConfig';
import { ResourceType } from '../types/ResourceType';
import { Person } from '../types/Søkerdata';
import { SøknadApiData } from '../types/SøknadApiData';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';

export const getSøker = () => axios.get<Person>(getApiUrlByResourceType(ResourceType.SØKER), axiosJsonConfig);

export const sendApplication = (data: SøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosJsonConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosJsonConfig);
