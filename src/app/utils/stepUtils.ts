import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    barnStepIsValid,
    arbeidssituasjonStepIsValid,
    medlemskapStepIsValid,
    periodeStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
    };
};

export const periodeStepIsAvailable = (formData: SøknadFormData) => welcomingPageIsValid(formData);

export const arbeidssituasjonStepIsAvailable = (formData: SøknadFormData) =>
    periodeStepIsAvailable(formData) && periodeStepIsValid(formData);

export const barnStepIsAvailable = (formData: SøknadFormData) =>
    arbeidssituasjonStepIsAvailable(formData) && arbeidssituasjonStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData) =>
    barnStepIsAvailable(formData) && barnStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) => medlemskapStepIsValid(formData);
