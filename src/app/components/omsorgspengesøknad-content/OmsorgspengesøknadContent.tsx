import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { CustomFormikProps } from '../../types/FormikProps';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import ArbeidStep from '../step/arbeid/ArbeidStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import SamværsavtaleStep from '../steps/samværsavtale/SamværsavtaleStep';
import SummaryStep from '../steps/summary/SummaryStep';

interface OmsorgspengesøknadContentProps {
    formikProps: CustomFormikProps;
}

export interface CommonStepFormikProps {
    formValues: OmsorgspengesøknadFormData;
    handleSubmit: () => void;
}

const OmsorgspengesøknadContent: React.FunctionComponent<OmsorgspengesøknadContentProps> = ({ formikProps }) => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { handleSubmit, values, isSubmitting, isValid, resetForm } = formikProps;
    const commonFormikProps: CommonStepFormikProps = { handleSubmit, formValues: formikProps.values };
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={(props) => (
                    <WelcomingPage
                        {...commonFormikProps}
                        {...props}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                        nextStepRoute={`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`}
                    />
                )}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={(props) => (
                        <OpplysningerOmBarnetStep
                            formikProps={formikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.OPPLYSNINGER_OM_BARNET, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEID, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEID)}
                    render={(props) => (
                        <ArbeidStep
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.ARBEID, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={(props) => (
                        <MedlemsskapStep
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.MEDLEMSKAP, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={(props) => (
                        <LegeerklæringStep
                            formikProps={formikProps}
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.LEGEERKLÆRING, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.SAMVÆRSAVTALE, values) && (
                <Route
                    path={getSøknadRoute(StepID.SAMVÆRSAVTALE)}
                    render={(props) => (
                        <SamværsavtaleStep
                            formikProps={formikProps}
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.SAMVÆRSAVTALE, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={(props) => <SummaryStep {...commonFormikProps} {...props} />}
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
