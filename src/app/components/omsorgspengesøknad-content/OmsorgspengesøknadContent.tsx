import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { navigateTo } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import SummaryStep from '../steps/summary/SummaryStep';
import NårKanManFåUtbetaltOmsorgspengerStep from '../steps/når-kan-man-få-utbetalt-omsorgspenger/NårKanManFåUtbetaltOmsorgspengerStep';
import HarUtbetaltDeFørsteTiDageneStep from '../steps/har-utbetalt-de-første-ti-dagene/HarUtbetaltDeFørsteTiDageneStep';
import PeriodeStep from '../steps/periode/PeriodeStep';
import HvisUtenlandsoppholdStep from '../steps/hvis-utenlandsopphold/HvisUtenlandsoppholdStep';
import InntektStep from '../steps/inntekt/InntektStep';

const OmsorgspengesøknadContent: React.FunctionComponent = () => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const formik = useFormikContext<OmsorgspengesøknadFormData>();
    const history = useHistory();
    const { values, resetForm } = formik;

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
                            formValues={values}
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
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    render={() => (
                        <PeriodeStep onValidSubmit={() => navigateToNextStep(StepID.PERIODE)} formValues={values} />
                    )}
                />
            )}

            {isAvailable(StepID.HVIS_UTENLANDSOPPHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.HVIS_UTENLANDSOPPHOLD)}
                    render={() => (
                        <HvisUtenlandsoppholdStep
                            onValidSubmit={() => navigateToNextStep(StepID.HVIS_UTENLANDSOPPHOLD)}
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => (
                        <LegeerklæringStep
                            onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)}
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.INNTEKT, values) && (
                <Route
                    path={getSøknadRoute(StepID.INNTEKT)}
                    render={() => (
                        <InntektStep onValidSubmit={() => navigateToNextStep(StepID.INNTEKT)} formValues={values} />
                    )}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => (
                        <MedlemsskapStep
                            onValidSubmit={() => navigateToNextStep(StepID.MEDLEMSKAP)}
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={(props) => <SummaryStep formValues={values} onValidSubmit={() => null} />}
                />
            )}

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => {
                        // we clear form state here to ensure that no steps will be available
                        // after the application has been sent. this is done in a setTimeout
                        // because we do not want to update state during render.
                        setTimeout(() => {
                            resetForm();
                        });
                        setSøknadHasBeenSent(true);
                        return <ConfirmationPage />;
                    }}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default OmsorgspengesøknadContent;
