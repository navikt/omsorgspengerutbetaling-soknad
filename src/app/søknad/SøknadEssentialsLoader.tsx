import * as React from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getSøker } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { Søkerdata } from '../types/Søkerdata';
import * as apiUtils from '../utils/apiUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';

interface Props {
    contentLoadedRenderer: (søkerdata?: Søkerdata) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    søkerdata?: Søkerdata;
}

class SøknadEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isLoading: true };

        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);

        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [søkerResponse] = await Promise.all([getSøker()]);
            this.handleSøkerdataFetchSuccess(søkerResponse);
        } catch (response) {
            this.handleSøkerdataFetchError(response);
        }
    }

    handleSøkerdataFetchSuccess(søkerResponse: AxiosResponse) {
        this.updateSøkerdata(
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

    updateSøkerdata(søkerdata: Søkerdata, callback?: () => void) {
        this.setState(
            {
                isLoading: false,
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
        const { isLoading, søkerdata } = this.state;

        if (isLoading) {
            return <LoadingPage />;
        }

        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(søkerdata)}
                </SøkerdataContextProvider>
            </>
        );
    }
}

export default SøknadEssentialsLoader;
