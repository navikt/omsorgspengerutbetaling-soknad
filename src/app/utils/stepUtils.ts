import { IntlShape } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/config/stepConfig';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import {
    harUtbetaltDeFørsteTiDagenePageIsValid,
    inntektStepIsValid,
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    nårKanManFåUtbetaltOmsorgspengerPageIsValid,
    periodeStepIsValid,
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

export const nårKanManFåUtbetaltOmsorgspengerAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData);

export const harUtbetaltDeFørsteTiDagene = (formData: OmsorgspengesøknadFormData) =>
    nårKanManFåUtbetaltOmsorgspengerPageIsValid(formData);

export const periodeAvailable = (formData: OmsorgspengesøknadFormData) =>
    harUtbetaltDeFørsteTiDagenePageIsValid(formData);

export const hvisUtenlandsoppholdAvailable = (formData: OmsorgspengesøknadFormData) => periodeStepIsValid(formData);

export const medlemskapStepAvailable = (formData: OmsorgspengesøknadFormData) => inntektStepIsValid(formData);

export const legeerklæringStepAvailable = (formData: OmsorgspengesøknadFormData) => medlemskapStepIsValid(formData);

export const inntektStepAvailable = (formData: OmsorgspengesøknadFormData) => legeerklæringStepIsValid();

export const summaryStepAvailable = (formData: OmsorgspengesøknadFormData) => legeerklæringStepIsValid();
