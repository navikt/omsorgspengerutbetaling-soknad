import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { useFormikContext } from 'formik';
import { SKJEMANAVN } from '../App';
import ConfirmationPage from '../components/pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../components/pages/welcoming-page/WelcomingPage';
import RouteConfig from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import * as apiUtils from '../utils/apiUtils';
import appSentryLogger from '../utils/appSentryLogger';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, navigateToLoginPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import BarnStep from './barn-step/BarnStep';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import PeriodeStep from './periode-step/PeriodeStep';
import SmittevernDokumenterStep from './smittevern-dokumenter-step/SmittvernDokumenterStep';
import StengtBhgSkoleDokumenterStep from './stengt-bhg-skole-dokumenter-step/StengtBhgSkoleDokumenterStep';
import SøknadTempStorage from './SøknadTempStorage';

export interface KvitteringInfo {
    søkernavn: string;
}

const SøknadRoutes: React.FunctionComponent = () => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { values, resetForm } = useFormikContext<SøknadFormData>();

    const skalViseStengtBhgSkoleVedleggSteg: boolean = values.hjemmePgaStengtBhgSkole === YesOrNo.YES;
    const skalViseSmittevernVedleggSteg: boolean = values.hjemmePgaSmittevernhensyn === YesOrNo.YES;

    const history = useHistory();
    const { logSoknadStartet, logUserLoggedOut } = useAmplitudeInstance();

    async function navigateToNextStepFrom(stepID: StepID) {
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.update(values, stepID);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    await logUserLoggedOut('Ved mellomlagring');
                    navigateToLoginPage();
                } else {
                    appSentryLogger.logApiError(error);
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

    const startSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        setTimeout(() => {
            if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                SøknadTempStorage.create().then(() => {
                    navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.PERIODE}`, history);
                });
            } else {
                navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.PERIODE}`, history);
            }
        });
    };

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => <WelcomingPage onValidSubmit={startSoknad} />}
            />

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    render={() => <PeriodeStep onValidSubmit={() => navigateToNextStepFrom(StepID.PERIODE)} />}
                />
            )}

            {isAvailable(StepID.DOKUMENTER_STENGT_SKOLE_BHG, values) && skalViseStengtBhgSkoleVedleggSteg && (
                <Route
                    path={getSøknadRoute(StepID.DOKUMENTER_STENGT_SKOLE_BHG)}
                    render={() => (
                        <StengtBhgSkoleDokumenterStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.DOKUMENTER_STENGT_SKOLE_BHG)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.DOKUMENTER_SMITTEVERNHENSYN, values) && skalViseSmittevernVedleggSteg && (
                <Route
                    path={getSøknadRoute(StepID.DOKUMENTER_SMITTEVERNHENSYN)}
                    render={() => (
                        <SmittevernDokumenterStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.DOKUMENTER_SMITTEVERNHENSYN)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSSITUASJON, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSSITUASJON)}
                    render={() => (
                        <ArbeidssituasjonStep onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSSITUASJON)} />
                    )}
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
                            onApplicationSent={() => {
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
                <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} render={() => <ConfirmationPage />} />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />

            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default SøknadRoutes;
