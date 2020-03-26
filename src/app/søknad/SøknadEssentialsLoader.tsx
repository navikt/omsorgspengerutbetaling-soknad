import * as React from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getSøker } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import * as apiUtils from '../utils/apiUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import SøknadTempStorage, { STORAGE_VERSION } from './SøknadTempStorage';

interface Props {
    contentLoadedRenderer: (
        søkerdata: Søkerdata | undefined,
        formData: SøknadFormData | undefined,
        lastStepID: StepID | undefined
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    lastStepID?: StepID;
    formData: SøknadFormData;
    søkerdata?: Søkerdata;
}

class SøknadEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isLoading: true, lastStepID: undefined, formData: initialValues };

        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);

        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                const [søkerResponse, tempStorage] = await Promise.all([getSøker(), SøknadTempStorage.rehydrate()]);
                this.handleSøkerdataFetchSuccess(søkerResponse, tempStorage);
            } else {
                const søkerResponse = await getSøker();
                this.handleSøkerdataFetchSuccess(søkerResponse);
            }
        } catch (response) {
            this.handleSøkerdataFetchError(response);
        }
    }

    getValidTemporaryStorage = (data?: TemporaryStorage): TemporaryStorage | undefined => {
        if (data?.metadata?.version === STORAGE_VERSION || data?.metadata !== undefined) {
            return data;
        }
        return undefined;
    };

    handleSøkerdataFetchSuccess(søkerResponse: AxiosResponse, tempStorageResponse?: AxiosResponse) {
        const tempStorage = this.getValidTemporaryStorage(tempStorageResponse?.data);
        const formData = tempStorage?.formData;
        const lastStepID = tempStorage?.metadata?.lastStepID;

        this.updateSøkerdata(
            formData || { ...initialValues },
            lastStepID,
            {
                person: søkerResponse.data
            },
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    window.location.assign(getRouteUrl(routeConfig.WELCOMING_PAGE_ROUTE));
                }
            }
        );
    }

    updateSøkerdata(
        formData: SøknadFormData,
        lastStepID: StepID | undefined,
        søkerdata: Søkerdata,
        callback?: () => void
    ) {
        this.setState(
            {
                isLoading: false,
                lastStepID,
                formData,
                søkerdata: søkerdata ? søkerdata : this.state.søkerdata
            },
            callback
        );
    }

    stopLoading() {
        this.setState({
            isLoading: false
        });
    }

    handleSøkerdataFetchError(response: AxiosError) {
        if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
        } else if (!userIsCurrentlyOnErrorPage()) {
            window.location.assign(getRouteUrl(routeConfig.ERROR_PAGE_ROUTE));
        }
        // this timeout is set because if isLoading is updated in the state too soon,
        // the contentLoadedRenderer() will be called while the user is still on the wrong route,
        // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
        setTimeout(this.stopLoading, 200);
    }

    render() {
        const { contentLoadedRenderer } = this.props;
        const { isLoading, søkerdata, formData, lastStepID } = this.state;

        if (isLoading) {
            return <LoadingPage />;
        }

        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(søkerdata, formData, lastStepID)}
                </SøkerdataContextProvider>
            </>
        );
    }
}

export default SøknadEssentialsLoader;
