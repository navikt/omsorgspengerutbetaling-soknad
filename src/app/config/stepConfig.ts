import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';
import { YesOrNo } from 'common/types/YesOrNo';

export enum StepID {
    'BARN' = 'barn',
    'PERIODE' = 'periode',
    'DOKUMENTER' = 'vedlegg',
    'LEGEERKLÆRING' = 'legeerklaering',
    'INNTEKT' = 'inntekt',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    stepIndicatorLabel: string;
    nextButtonLabel?: string;
    nextButtonAriaLabel?: string;
}

export interface StepItemConfigInterface extends StepConfigItemTexts {
    index: number;
    nextStep?: StepID;
    backLinkHref?: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        stepIndicatorLabel: `step.${stepId}.stepIndicatorLabel`,
        nextButtonLabel: 'step.nextButtonLabel',
        nextButtonAriaLabel: 'step.nextButtonAriaLabel',
    };
};

export const getStepConfig = (formData?: SøknadFormData): StepConfigInterface => {
    let idx = 0;

    const skalViseDokumenterStep = formData ? formData[SøknadFormField.hemmeligJaNeiSporsmal] : undefined;

    const configDelEn = {
        [StepID.PERIODE]: {
            ...getStepConfigItemTextKeys(StepID.PERIODE),
            index: idx++,
            nextStep:
                skalViseDokumenterStep && skalViseDokumenterStep === YesOrNo.YES ? StepID.DOKUMENTER : StepID.INNTEKT,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
    };

    let configMaybeSteg = {};
    if (skalViseDokumenterStep && skalViseDokumenterStep === YesOrNo.YES) {
        configMaybeSteg = {
            [StepID.DOKUMENTER]: {
                ...getStepConfigItemTextKeys(StepID.DOKUMENTER),
                index: idx++,
                nextStep: StepID.INNTEKT,
                backLinkHref: getSøknadRoute(StepID.PERIODE),
            },
        };
    }

    const configDelTo = {
        [StepID.INNTEKT]: {
            ...getStepConfigItemTextKeys(StepID.INNTEKT),
            index: idx++,
            nextStep: StepID.BARN,
            backLinkHref:
                skalViseDokumenterStep && skalViseDokumenterStep === YesOrNo.YES
                    ? getSøknadRoute(StepID.DOKUMENTER)
                    : getSøknadRoute(StepID.PERIODE),
        },
        [StepID.BARN]: {
            ...getStepConfigItemTextKeys(StepID.BARN),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.INNTEKT),
        },
        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.OPPSUMMERING,
            backLinkHref: getSøknadRoute(StepID.BARN),
        },
        [StepID.OPPSUMMERING]: {
            ...getStepConfigItemTextKeys(StepID.OPPSUMMERING),
            index: idx++,
            backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
            nextButtonLabel: 'step.sendButtonLabel',
            nextButtonAriaLabel: 'step.sendButtonAriaLabel',
        },
    };

    return {
        ...configDelEn,
        ...configMaybeSteg,
        ...configDelTo,
    };
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const stepConfig: StepConfigInterface = getStepConfig();
