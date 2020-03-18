import RouteConfig from '../config/routeConfig';
import { getStepConfig, StepID } from '../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { appIsRunningInDevEnvironment } from './envUtils';
import {
    harUtbetaltDeFørsteTiDagene,
    inntektStepAvailable,
    legeerklæringStepAvailable,
    medlemskapStepAvailable,
    nårKanManFåUtbetaltOmsorgspengerAvailable,
    periodeAvailable,
    summaryStepAvailable
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: SøknadFormData): string | undefined => {
    const stepConfig = getStepConfig(formData);
    return stepConfig[stepId] ? getSøknadRoute(stepConfig[stepId].nextStep) : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: SøknadFormData) => {
    if (!appIsRunningInDevEnvironment()) {
        switch (path) {
            case StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER:
                return nårKanManFåUtbetaltOmsorgspengerAvailable(values);
            case StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE:
                return harUtbetaltDeFørsteTiDagene(values);
            case StepID.PERIODE:
                return periodeAvailable(values);
            case StepID.LEGEERKLÆRING:
                return legeerklæringStepAvailable(values);
            case StepID.INNTEKT:
                return inntektStepAvailable(values);
            case StepID.MEDLEMSKAP:
                return medlemskapStepAvailable(values);
            case StepID.SUMMARY:
                return summaryStepAvailable(values);
            case RouteConfig.SØKNAD_SENDT_ROUTE:
                return values[SøknadFormField.harBekreftetOpplysninger];
        }
    }
    return true;
};
