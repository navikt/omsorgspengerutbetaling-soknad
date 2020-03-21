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
import { navigateTo } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import EgenutbetalingStep from './steps/egenutbetaling/EgenutbetalingStep';
import InntektStep from './steps/inntekt/InntektStep';
// import LegeerklæringStep from './steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from './steps/medlemskap/MedlemsskapStep';
import OppsummeringStep from './steps/oppsummering/OppsummeringStep';
import PeriodeStep from './steps/periode/PeriodeStep';
import HvaErDinSituasjon from './steps/situasjon/SituasjonStep';

export interface KvitteringInfo {
    søkernavn: string;
}

const getKvitteringInfoFromApiData = (søkerdata: Søkerdata): KvitteringInfo | undefined => {
    const { fornavn, mellomnavn, etternavn } = søkerdata.person;
    return {
        søkernavn: formatName(fornavn, etternavn, mellomnavn)
    };
};

const SøknadContent: React.FunctionComponent = () => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<SøknadFormData>();

    const history = useHistory();

    const navigateToNextStep = (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => (
                    <WelcomingPage
                        onValidSubmit={() =>
                            setTimeout(() => {
                                navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.SITUASJON}`, history);
                            })
                        }
                    />
                )}
            />

            {isAvailable(StepID.SITUASJON, values) && (
                <Route
                    path={getSøknadRoute(StepID.SITUASJON)}
                    render={() => <HvaErDinSituasjon onValidSubmit={() => navigateToNextStep(StepID.SITUASJON)} />}
                />
            )}

            {isAvailable(StepID.EGENUTBETALING, values) && (
                <Route
                    path={getSøknadRoute(StepID.EGENUTBETALING)}
                    render={() => (
                        <EgenutbetalingStep onValidSubmit={() => navigateToNextStep(StepID.EGENUTBETALING)} />
                    )}
                />
            )}

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    render={() => <PeriodeStep onValidSubmit={() => navigateToNextStep(StepID.PERIODE)} />}
                />
            )}

            {/* {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => <LegeerklæringStep onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)} />}
                />
            )} */}

            {isAvailable(StepID.INNTEKT, values) && (
                <Route
                    path={getSøknadRoute(StepID.INNTEKT)}
                    render={() => <InntektStep onValidSubmit={() => navigateToNextStep(StepID.INNTEKT)} />}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStep(StepID.MEDLEMSKAP)} />}
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
};

export default SøknadContent;
