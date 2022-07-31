import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getSokerRemoteData from '../api/getSoker';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { Barn, Person } from '../types/Søkerdata';
import getBarnRemoteData from '../api/getBarn';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

export type SoknadEssentials = [Person, Barn[], SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, barnResult, soknadTempStorageResult] = await Promise.all([
                getSokerRemoteData(),
                getBarnRemoteData(),
                getSoknadTempStorage(),
            ]);
            setData(combine(sokerResult, barnResult, soknadTempStorageResult));
        } catch (remoteDataError) {
            if (isUserLoggedOut(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
                setData(remoteDataError);
            }
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return data;
}

export default useSoknadEssentials;
