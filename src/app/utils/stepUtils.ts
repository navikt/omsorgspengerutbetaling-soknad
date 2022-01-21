import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    arbeidssituasjonStepIsValid,
    dineBarnStepIsValid,
    fraværStepIsValid,
    medlemskapStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { Barn } from '../types/Søkerdata';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
    };
};

export const dineBarnStepIsAvailable = (formData: SøknadFormData) => welcomingPageIsValid(formData);

export const fraværStepIsAvailable = (formData: SøknadFormData, registrerteBarn: Barn[] = []) =>
    dineBarnStepIsValid(formData, registrerteBarn);

export const arbeidssituasjonStepIsAvailable = (formData: SøknadFormData) => fraværStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData) =>
    arbeidssituasjonStepIsAvailable(formData) && arbeidssituasjonStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) => medlemskapStepIsValid(formData);
