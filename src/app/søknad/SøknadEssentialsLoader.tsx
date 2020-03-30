import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { getSøker } from '../api/api';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { Person, Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import * as apiUtils from '../utils/apiUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import {
    navigateTo, navigateToErrorPage, navigateToLoginPage, navigateToWelcomePage,
    userIsCurrentlyOnErrorPage, userIsOnStep
} from '../utils/navigationUtils';
import SøknadTempStorage, { STORAGE_VERSION } from './SøknadTempStorage';

interface Props {
    contentLoadedRenderer: (
        søkerdata?: Søkerdata | undefined,
        formData?: SøknadFormData | undefined
    ) => React.ReactNode;
}

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

interface Essentials {
    søkerdata: Søkerdata | undefined;
    formData: SøknadFormData | undefined;
}

const SøknadEssentialsLoader = ({ contentLoadedRenderer }: Props) => {
    const history = useHistory();
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [essentials, setEssentials] = useState<Essentials | undefined>();

    async function loadEssentials() {
        if (essentials?.søkerdata === undefined && loadState.error === undefined) {
            try {
                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                    const [søkerResponse, tempStorage] = await Promise.all([getSøker(), SøknadTempStorage.rehydrate()]);
                    handleEssentialsFetchSuccess(søkerResponse, tempStorage);
                } else {
                    const søkerResponse = await getSøker();
                    handleEssentialsFetchSuccess(søkerResponse);
                }
            } catch (response) {
                if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
                    navigateToLoginPage();
                } else if (!userIsCurrentlyOnErrorPage()) {
                    navigateToErrorPage(history);
                }
                setLoadState({ isLoading: false, error: true });
            }
        }
    }

    const getValidTemporaryStorage = (data?: TemporaryStorage): TemporaryStorage | undefined => {
        if (data?.metadata?.version === STORAGE_VERSION) {
            return data;
        }
        return undefined;
    };

    const handleEssentialsFetchSuccess = (
        søkerResponse: AxiosResponse<Person>,
        tempStorageResponse?: AxiosResponse
    ) => {
        const tempStorage = getValidTemporaryStorage(tempStorageResponse?.data);
        const formData = tempStorage?.formData;
        const lastStepID = tempStorage?.metadata?.lastStepID;
        setEssentials({ søkerdata: { person: søkerResponse.data }, formData: formData || { ...initialValues } });
        setLoadState({ isLoading: false, error: undefined });

        if (userIsCurrentlyOnErrorPage()) {
            if (lastStepID) {
                navigateTo(lastStepID, history);
            } else {
                navigateToWelcomePage();
            }
        } else if (lastStepID && !userIsOnStep(lastStepID, history)) {
            navigateTo(lastStepID, history);
        }
    };

    useEffect(() => {
        loadEssentials();
    }, [essentials, loadState]);

    const { isLoading, error } = loadState;

    return (
        <LoadWrapper
            isLoading={isLoading && error === undefined}
            contentRenderer={() => (
                <SøkerdataContextProvider value={essentials?.søkerdata}>
                    {contentLoadedRenderer(essentials?.søkerdata, essentials?.formData)}
                </SøkerdataContextProvider>
            )}
        />
    );
};
export default SøknadEssentialsLoader;
