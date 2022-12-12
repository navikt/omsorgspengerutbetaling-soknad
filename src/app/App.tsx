import * as React from 'react';
import { render } from 'react-dom';
import { Redirect, Route } from 'react-router-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude/lib';
import SoknadApplication from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplication';
import SoknadApplicationCommonRoutes from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplicationCommonRoutes';
import Modal from 'nav-frontend-modal';
import RouteConfig from './config/routeConfig';
import { applicationIntlMessages } from './i18n/applicationMessages';
import SoknadRemoteDataFetcher from './søknad/SoknadRemoteDataFetcher';
import appSentryLogger from './utils/appSentryLogger';
import { getEnvironmentVariable } from './utils/envUtils';
import './styles/app.less';

appSentryLogger.init();

export const APPLICATION_KEY = 'omsorgspengerutbetaling-soknad';
export const SKJEMANAVN = 'omsorgspengerutbetaling-sn-fri';

const App: React.FunctionComponent = () => {
    const publicPath = getEnvironmentVariable('PUBLIC_PATH');

    return (
        <AmplitudeProvider applicationKey={APPLICATION_KEY}>
            <SoknadApplication
                appName={SKJEMANAVN}
                intlMessages={applicationIntlMessages}
                sentryKey={APPLICATION_KEY}
                appStatus={{
                    applicationKey: APPLICATION_KEY,
                    sanityConfig: {
                        projectId: getEnvironmentVariable('APPSTATUS_PROJECT_ID'),
                        dataset: getEnvironmentVariable('APPSTATUS_DATASET'),
                    },
                }}
                publicPath={publicPath}>
                <SoknadApplicationCommonRoutes
                    contentRoutes={[
                        <Route path="/" key="redirect" exact={true}>
                            <Redirect to={RouteConfig.SØKNAD_ROUTE_PREFIX} />
                        </Route>,
                        <Route
                            path={RouteConfig.SØKNAD_ROUTE_PREFIX}
                            key="soknad"
                            component={SoknadRemoteDataFetcher}
                        />,
                        <Route path={'/'} key="redirect">
                            <Redirect path="/" key="start" to={RouteConfig.WELCOMING_PAGE_ROUTE} />,
                        </Route>,
                    ]}
                />
            </SoknadApplication>
        </AmplitudeProvider>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
