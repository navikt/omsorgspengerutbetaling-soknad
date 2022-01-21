import { Barn } from '../types/Søkerdata';
import RouteConfig from '../config/routeConfig';
import { getStepConfig, StepID } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    arbeidssituasjonStepIsAvailable,
    dineBarnStepIsAvailable,
    fraværStepIsAvailable,
    medlemskapStepIsAvailable,
    summaryStepAvailable,
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepId = (stepId: StepID, formData?: SøknadFormData): StepID | undefined => {
    const stepConfig = getStepConfig(formData);
    return stepConfig[stepId] ? stepConfig[stepId].nextStep : undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: SøknadFormData): string | undefined => {
    const nextStepId = getNextStepId(stepId, formData);
    return nextStepId ? getSøknadRoute(nextStepId) : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: SøknadFormData, registrerteBarn?: Barn[]) => {
    switch (path) {
        case StepID.DINE_BARN:
            return dineBarnStepIsAvailable(values);
        case StepID.FRAVÆR:
            return fraværStepIsAvailable(values, registrerteBarn);
        case StepID.ARBEIDSSITUASJON:
            return arbeidssituasjonStepIsAvailable(values);
        case StepID.MEDLEMSKAP:
            return medlemskapStepIsAvailable(values);
        case StepID.OPPSUMMERING:
            return summaryStepAvailable(values);
        case RouteConfig.SØKNAD_SENDT_ROUTE:
            return values.harBekreftetOpplysninger;
    }
    return true;
};
