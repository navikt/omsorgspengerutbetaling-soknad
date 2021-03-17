import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { validateFørsteDagMedFravær, validateSisteDagMedFravær } from '../validation/fieldValidations';
import {
    arbeidssituasjonStepIsValid,
    barnStepIsValid,
    fraværStepIsValid,
    medlemskapStepIsValid,
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

export const periodeStepIsAvailable = (formData: SøknadFormData) => {
    return (
        welcomingPageIsValid(formData) &&
        validateFørsteDagMedFravær(formData.førsteDagMedFravær) === undefined &&
        validateSisteDagMedFravær(formData.sisteDagMedFravær, formData.førsteDagMedFravær) === undefined
    );
};
export const barnStepIsAvailable = (formData: SøknadFormData) => periodeStepIsAvailable(formData);

export const fraværStepIsAvailable = (formData: SøknadFormData) =>
    barnStepIsAvailable(formData) && barnStepIsValid(formData);

export const arbeidssituasjonStepIsAvailable = (formData: SøknadFormData) =>
    fraværStepIsAvailable(formData) && fraværStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData) =>
    arbeidssituasjonStepIsAvailable(formData) && arbeidssituasjonStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) => medlemskapStepIsValid(formData);
