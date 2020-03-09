import * as React from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker } from '../../api/api';
import routeConfig, { getRouteUrl } from '../../config/routeConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import demoSøkerdata from '../../demo/demoData';
import { Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import { appIsRunningInDemoMode } from '../../utils/envUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import LoadingPage from '../pages/loading-page/LoadingPage';

interface Props {
    contentLoadedRenderer: (søkerdata?: Søkerdata) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    søkerdata?: Søkerdata;
}

class AppEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isLoading: true };

        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);
        this.initDemoMode = this.initDemoMode.bind(this);

        if (appIsRunningInDemoMode()) {
            setTimeout(this.initDemoMode, 1000);
        } else {
            this.loadAppEssentials();
        }
    }

    async loadAppEssentials() {
        try {
            const [søkerResponse, barnResponse] = await Promise.all([getSøker(), getBarn()]);
            this.handleSøkerdataFetchSuccess(søkerResponse, barnResponse);
        } catch (response) {
            this.handleSøkerdataFetchError(response);
        }
    }

    initDemoMode() {
        this.setState({
            isLoading: false,
            søkerdata: {
                ...(demoSøkerdata as Søkerdata)
            }
        });
        this.stopLoading();
    }

    handleSøkerdataFetchSuccess(søkerResponse: AxiosResponse, barnResponse?: AxiosResponse) {
        this.updateSøkerdata(
            {
                person: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined
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

export default AppEssentialsLoader;
