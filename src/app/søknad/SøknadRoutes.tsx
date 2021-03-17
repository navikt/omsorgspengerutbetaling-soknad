import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
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
import { navigateTo, navigateToLoginPage } from '../utils/navigationUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import BarnStep from './barn-step/BarnStep';
import FraværStep from './fravær-step/FraværStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import PeriodeStep from './periode-step/PeriodeStep';
import SmittevernDokumenterStep from './smittevern-dokumenter-step/SmittvernDokumenterStep';
import StengtBhgSkoleDokumenterStep from './stengt-bhg-skole-dokumenter-step/StengtBhgSkoleDokumenterStep';
import SøknadTempStorage from './SøknadTempStorage';
import { Søkerdata } from '../types/Søkerdata';

export interface KvitteringInfo {
    søkernavn: string;
}

interface Props {
    søkerdata: Søkerdata | undefined;
}

const SøknadRoutes: React.FunctionComponent<Props> = ({ søkerdata }) => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { values, resetForm } = useFormikContext<SøknadFormData>();
    const registrerteBarn = søkerdata?.registrerteBarn || [];

    const history = useHistory();
    const { logSoknadStartet, logUserLoggedOut } = useAmplitudeInstance();

    const fraværPgaStengBhgSkole: boolean = harFraværPgaStengBhgSkole(values.fraværPerioder, values.fraværDager);
    const fraværPgaSmittevernhensyn: boolean = harFraværPgaSmittevernhensyn(values.fraværPerioder, values.fraværDager);

    async function navigateToNextStepFrom(stepID: StepID) {
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
            SøknadTempStorage.create().then(() => {
                navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.PERIODE}`, history);
            });
        });
    };

    const førsteDagMedFravær = datepickerUtils.getDateFromDateString(values.førsteDagMedFravær);
    const sisteDagMedFravær = datepickerUtils.getDateFromDateString(values.sisteDagMedFravær);

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

            {isAvailable(StepID.FRAVÆR, values) && førsteDagMedFravær && sisteDagMedFravær && (
                <Route
                    path={getSøknadRoute(StepID.FRAVÆR)}
                    render={() => (
                        <FraværStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.FRAVÆR)}
                            førsteDagMedFravær={førsteDagMedFravær}
                            sisteDagMedFravær={sisteDagMedFravær}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.DOKUMENTER_STENGT_SKOLE_BHG, values) && fraværPgaStengBhgSkole && (
                <Route
                    path={getSøknadRoute(StepID.DOKUMENTER_STENGT_SKOLE_BHG)}
                    render={() => (
                        <StengtBhgSkoleDokumenterStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.DOKUMENTER_STENGT_SKOLE_BHG)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.DOKUMENTER_SMITTEVERNHENSYN, values) && fraværPgaSmittevernhensyn && (
                <Route
                    path={getSøknadRoute(StepID.DOKUMENTER_SMITTEVERNHENSYN)}
                    render={() => (
                        <SmittevernDokumenterStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.DOKUMENTER_SMITTEVERNHENSYN)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSSITUASJON, values) && førsteDagMedFravær && sisteDagMedFravær && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSSITUASJON)}
                    render={() => (
                        <ArbeidssituasjonStep
                            førsteDagMedFravær={førsteDagMedFravær}
                            sisteDagMedFravær={sisteDagMedFravær}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSSITUASJON)}
                        />
                    )}
                />
            )}
            {isAvailable(StepID.BARN, values) && (
                <Route
                    path={getSøknadRoute(StepID.BARN)}
                    render={() => (
                        <BarnStep
                            registrerteBarn={registrerteBarn}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.BARN)}
                        />
                    )}
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
                            hjemmePgaSmittevernhensyn={fraværPgaSmittevernhensyn}
                            hjemmePgaStengtBhgSkole={fraværPgaStengBhgSkole}
                            onApplicationSent={() => {
                                setSøknadHasBeenSent(true);
                                resetForm();
                                SøknadTempStorage.purge();
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
