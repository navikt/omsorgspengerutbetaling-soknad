import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { useFormikContext } from 'formik';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { navigateTo } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import HarUtbetaltDeFørsteTiDageneStep from './steps/har-utbetalt-de-første-ti-dagene/HarUtbetaltDeFørsteTiDageneStep';
import HvisUtenlandsoppholdStep from './steps/hvis-utenlandsopphold/HvisUtenlandsoppholdStep';
import InntektStep from './steps/inntekt/InntektStep';
import LegeerklæringStep from './steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from './steps/medlemskap/MedlemsskapStep';
import NårKanManFåUtbetaltOmsorgspengerStep from './steps/når-kan-man-få-utbetalt-omsorgspenger/NårKanManFåUtbetaltOmsorgspengerStep';
import PeriodeStep from './steps/periode/PeriodeStep';
import SummaryStep from './steps/summary/SummaryStep';

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
                                navigateTo(
                                    `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER}`,
                                    history
                                );
                            })
                        }
                    />
                )}
            />

            {isAvailable(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER, values) && (
                <Route
                    path={getSøknadRoute(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER)}
                    render={() => (
                        <NårKanManFåUtbetaltOmsorgspengerStep
                            onValidSubmit={() => navigateToNextStep(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE, values) && (
                <Route
                    path={getSøknadRoute(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE)}
                    render={() => (
                        <HarUtbetaltDeFørsteTiDageneStep
                            onValidSubmit={() => navigateToNextStep(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    render={() => <PeriodeStep onValidSubmit={() => navigateToNextStep(StepID.PERIODE)} />}
                />
            )}

            {isAvailable(StepID.HVIS_UTENLANDSOPPHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.HVIS_UTENLANDSOPPHOLD)}
                    render={() => (
                        <HvisUtenlandsoppholdStep
                            onValidSubmit={() => navigateToNextStep(StepID.HVIS_UTENLANDSOPPHOLD)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => <LegeerklæringStep onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)} />}
                />
            )}

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

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => (
                        <SummaryStep
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
