import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { getSøker, getBarn, BarnResultType } from '../api/api';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { Person, Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import appSentryLogger from '../utils/appSentryLogger';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToLoginPage,
    navigateToWelcomePage,
    userIsCurrentlyOnErrorPage,
    userIsOnStep,
} from '../utils/navigationUtils';
import SøknadTempStorage, { STORAGE_VERSION } from './SøknadTempStorage';
import IkkeTilgangPage from '../components/pages/ikke-tilgang-page/IkkeTilgangPage';

interface Props {
    contentLoadedRenderer: (
        søkerdata?: Søkerdata,
        barn?: BarnResultType,
        formData?: SøknadFormData | undefined
    ) => React.ReactNode;
}

interface LoadState {
    isLoading: boolean;
    doApiCalls: boolean;
    hasNoAccess?: boolean;
    error?: boolean;
}

interface Essentials {
    søkerdata: Søkerdata;
    barn: BarnResultType;
    formData: SøknadFormData | undefined;
}

const SøknadEssentialsLoader: React.FunctionComponent<Props> = ({ contentLoadedRenderer }) => {
    const history = useHistory();
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true, doApiCalls: true });
    const [essentials, setEssentials] = useState<Essentials | undefined>();

    const getValidTemporaryStorage = (data?: TemporaryStorage): TemporaryStorage | undefined => {
        if (data?.metadata?.version === STORAGE_VERSION) {
            return data;
        }
        return undefined;
    };

    useEffect(() => {
        const handleEssentialsFetchSuccess = (
            søkerResponse: AxiosResponse<Person>,
            barnResponse: AxiosResponse<BarnResultType>,
            tempStorageResponse?: AxiosResponse
        ) => {
            const tempStorage = getValidTemporaryStorage(tempStorageResponse?.data);
            const formData = tempStorage?.formData;
            const lastStepID = tempStorage?.metadata?.lastStepID;

            setEssentials({
                søkerdata: {
                    person: søkerResponse.data,
                },
                barn: barnResponse.data,
                formData: formData || { ...initialValues },
            });

            setLoadState({ isLoading: false, doApiCalls: false, error: undefined });

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
        async function loadEssentials() {
            if (essentials?.søkerdata === undefined && loadState.error === undefined) {
                try {
                    const [søkerResponse, barnResponse, tempStorage] = await Promise.all([
                        getSøker(),
                        getBarn(),
                        SøknadTempStorage.rehydrate(),
                    ]);
                    handleEssentialsFetchSuccess(søkerResponse, barnResponse, tempStorage);
                } catch (error) {
                    if (isUnauthorized(error)) {
                        navigateToLoginPage();
                        setLoadState({ isLoading: true, doApiCalls: false, error: undefined });
                    } else if (isForbidden(error)) {
                        setLoadState({ isLoading: false, doApiCalls: false, error: false, hasNoAccess: true });
                    } else if (!userIsCurrentlyOnErrorPage()) {
                        appSentryLogger.logApiError(error);
                        navigateToErrorPage(history);
                        setLoadState({ isLoading: false, doApiCalls: false, error: true });
                    } else {
                        setLoadState({ isLoading: false, doApiCalls: false, error: true });
                    }
                }
            }
        }
        if (loadState.doApiCalls) {
            loadEssentials();
        }
    }, [essentials, loadState, history]);

    const { isLoading, error, hasNoAccess } = loadState;

    if (hasNoAccess) {
        return <IkkeTilgangPage />;
    }

    return (
        <LoadWrapper
            isLoading={isLoading && error === undefined}
            contentRenderer={() => (
                <SøkerdataContextProvider value={essentials?.søkerdata}>
                    {contentLoadedRenderer(essentials?.søkerdata, essentials?.barn, essentials?.formData)}
                </SøkerdataContextProvider>
            )}
        />
    );
};
export default SøknadEssentialsLoader;
