import { ApiEndpoint } from '../types/ApiEndpoint';
import { SøknadApiData } from '../types/SøknadApiData';
import api from './api';

export const sendSoknad = (data: SøknadApiData) => api.post(ApiEndpoint.SEND_SØKNAD, data);
