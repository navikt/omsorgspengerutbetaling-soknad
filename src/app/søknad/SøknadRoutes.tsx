import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { useFormikContext } from 'formik';
import ConfirmationPage from '../components/pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../components/pages/welcoming-page/WelcomingPage';
import RouteConfig from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { Søkerdata } from '../types/Søkerdata';
import { SøknadApiData } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, navigateToLoginPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import InntektStep from './inntekt-step/InntektStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import PeriodeStep from './periode-step/PeriodeStep';
import BarnStep from './barn-step/BarnStep';
import SøknadTempStorage from './SøknadTempStorage';
import * as apiUtils from '../utils/apiUtils';

export interface KvitteringInfo {
    søkernavn: string;
}

const getKvitteringInfoFromApiData = (søkerdata: Søkerdata): KvitteringInfo | undefined => {
    const { fornavn, mellomnavn, etternavn } = søkerdata.person;
    return {
        søkernavn: formatName(fornavn, etternavn, mellomnavn)
    };
};

interface SøknadRoutes {
    lastStepID?: StepID;
}

function SøknadRoutes({ lastStepID }: SøknadRoutes) {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<SøknadFormData>();

    const history = useHistory();

    if (history.location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE && lastStepID && !søknadHasBeenSent) {
        setTimeout(() => {
            navigateTo(lastStepID, history);
        });
    }

    async function navigateToNextStepFrom(stepID: StepID) {
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.persist(values, stepID);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
                }
            }
        }
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepID, values);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    }

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => (
                    <WelcomingPage
                        onValidSubmit={() =>
                            setTimeout(() => {
                                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                                    SøknadTempStorage.persist(values, StepID.PERIODE).then(() => {
                                        navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.PERIODE}`, history);
                                    });
                                } else {
                                    navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.PERIODE}`, history);
                                }
                            })
                        }
                    />
                )}
            />

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    render={() => <PeriodeStep onValidSubmit={() => navigateToNextStepFrom(StepID.PERIODE)} />}
                />
            )}

            {isAvailable(StepID.INNTEKT, values) && (
                <Route
                    path={getSøknadRoute(StepID.INNTEKT)}
                    render={() => <InntektStep onValidSubmit={() => navigateToNextStepFrom(StepID.INNTEKT)} />}
                />
            )}
            {isAvailable(StepID.BARN, values) && (
                <Route
                    path={getSøknadRoute(StepID.BARN)}
                    render={() => <BarnStep onValidSubmit={() => navigateToNextStepFrom(StepID.BARN)} />}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStepFrom(StepID.MEDLEMSKAP)} />}
                />
            )}

            {isAvailable(StepID.OPPSUMMERING, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPSUMMERING)}
                    render={() => (
                        <OppsummeringStep
                            onApplicationSent={(apiData: SøknadApiData, søkerdata: Søkerdata) => {
                                const info = getKvitteringInfoFromApiData(søkerdata);
                                setKvitteringInfo(info);
                                setSøknadHasBeenSent(true);
                                resetForm();
                                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                                    SøknadTempStorage.purge();
                                }
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )}
                />
            )}

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => <ConfirmationPage kvitteringInfo={kvitteringInfo} />}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />

            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
}

export default SøknadRoutes;
