import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    harUtbetaltDeFørsteTiDagenePageIsValid, inntektStepIsValid, legeerklæringStepIsValid,
    medlemskapStepIsValid, nårKanManFåUtbetaltOmsorgspengerPageIsValid, periodeStepIsValid,
    welcomingPageIsValid
} from '../validation/stepValidations';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
        nextButtonAriaLabel: conf.nextButtonAriaLabel ? intlHelper(intl, conf.nextButtonAriaLabel) : undefined
    };
};

export const nårKanManFåUtbetaltOmsorgspengerAvailable = (formData: SøknadFormData) => welcomingPageIsValid(formData);

export const harUtbetaltDeFørsteTiDagene = (formData: SøknadFormData) =>
    nårKanManFåUtbetaltOmsorgspengerPageIsValid(formData);

export const periodeAvailable = (formData: SøknadFormData) => harUtbetaltDeFørsteTiDagenePageIsValid(formData);

export const legeerklæringStepAvailable = (formData: SøknadFormData) => periodeStepIsValid(formData);

export const inntektStepAvailable = (formData: SøknadFormData) => legeerklæringStepIsValid();

export const medlemskapStepAvailable = (formData: SøknadFormData) => inntektStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) => medlemskapStepIsValid(formData);
