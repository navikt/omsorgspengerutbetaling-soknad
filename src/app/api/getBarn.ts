import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import api from './api';
import { ApiEndpoint } from '../types/ApiEndpoint';
import { Barn } from '../types/Søkerdata';

export type BarnRemoteData = RemoteData<AxiosError, Barn[]>;

interface BarnResultType {
    barn: Barn[];
}
const getBarnRemoteData = async (): Promise<BarnRemoteData> => {
    try {
        const { data } = await api.get<BarnResultType>(ApiEndpoint.BARN);
        return Promise.resolve(success(data.barn));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getBarnRemoteData;
