import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import RouteConfig from '../config/routeConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';
import { getAvailableSteps } from '../utils/routeUtils';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import FraværStep from './fravær-step/FraværStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import SmittevernDokumenterStep from './smittevern-dokumenter-step/SmittvernDokumenterStep';
import StengtBhgSkoleDokumenterStep from './stengt-bhg-skole-dokumenter-step/StengtBhgSkoleDokumenterStep';
import FraværFraStep from './fravær-fra-step/FraværFraStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import { Barn, Person } from '../types/Søkerdata';
import { StepID } from './soknadStepsConfig';
import { SøknadApiData } from '../types/SøknadApiData';
import { mapFormDataToApiData } from '../utils/mapFormDataToApiData';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import { useIntl } from 'react-intl';
import { useSoknadContext } from './SoknadContext';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import VelkommenPage from '../pages/velkommen-page/VelkommenPage';
import LegeerklæringDokumenterStep from './legeerklæring-dokumenter-step/LegeerklæringDokumenterStep';

interface Props {
    søker: Person;
    barn?: Barn[];
    soknadId?: string;
}

const SøknadRoutes: React.FC<Props> = ({ søker, barn = [], soknadId }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const availableSteps = getAvailableSteps(values, barn);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();

    const fraværPgaStengBhgSkole: boolean = harFraværPgaStengBhgSkole(values.fraværPerioder, values.fraværDager);
    const fraværPgaSmittevernhensyn: boolean = harFraværPgaSmittevernhensyn(values.fraværPerioder, values.fraværDager);

    const renderSoknadStep = (søker: Person, stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.DINE_BARN:
                return <DineBarnStep barn={barn} søker={søker} soknadId={soknadId} />;
            case StepID.FRAVÆR:
                return <FraværStep />;
            case StepID.DOKUMENTER_STENGT_SKOLE_BHG:
                return <StengtBhgSkoleDokumenterStep />;
            case StepID.DOKUMENTER_SMITTEVERNHENSYN:
                return <SmittevernDokumenterStep />;
            case StepID.DOKUMENTER_LEGEERKLÆRING:
                return <LegeerklæringDokumenterStep />;
            case StepID.ARBEIDSSITUASJON:
                return <ArbeidssituasjonStep barn={barn} søker={søker} soknadId={soknadId} />;
            case StepID.FRAVÆR_FRA:
                return <FraværFraStep />;
            case StepID.MEDLEMSKAP:
                return <MedlemsskapStep />;
            case StepID.OPPSUMMERING:
                const apiValues: SøknadApiData = mapFormDataToApiData(values, intl, barn);
                return (
                    <OppsummeringStep
                        hjemmePgaSmittevernhensyn={fraværPgaSmittevernhensyn}
                        dokumenterSmittevernhensyn={values.dokumenterSmittevernhensyn}
                        hjemmePgaStengtBhgSkole={fraværPgaStengBhgSkole}
                        dokumenterStengtBkgSkole={values.dokumenterStengtBkgSkole}
                        dokumenterLegeerklæring={values.dokumenterLegeerklæring}
                        apiValues={apiValues}
                        søker={søker}
                    />
                );
        }
    };

    const lastAvailableStep = availableSteps.slice(-1)[0];

    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;

    return (
        <Switch>
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} exact={true}>
                <VelkommenPage />
            </Route>

            <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status)) {
                            return <ConfirmationPage />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>

            {soknadId === undefined && <Redirect key="redirectToWelcome" to={RouteConfig.SØKNAD_ROUTE_PREFIX} />}
            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => renderSoknadStep(søker, step)}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={() => (
                        <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />
                    )}></ErrorPage>
            </Route>
        </Switch>
    );
};

export default SøknadRoutes;
