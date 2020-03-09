import {OmsorgspengesøknadFormData} from '../types/OmsorgspengesøknadFormData';
import {getSøknadRoute} from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER' = 'når-kan-man-få-utbetalt-omsorgspenger',
    'HAR_UTBETALT_DE_FØRST_TI_DAGENE' = 'har-utbetalt-de-første-ti-dagene',

    'PERIODE' = 'periode',
    'HVIS_UTENLANDSOPPHOLD' = 'hvis-utenlandsopphold',

    'LEGEERKLÆRING' = 'legeerklaering',
    'INNTEKT' = 'inntekt',
    'MEDLEMSKAP' = 'medlemskap',

    'SUMMARY' = 'oppsummering'
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
        nextButtonAriaLabel: 'step.nextButtonAriaLabel'
    };
};

export const getStepConfig = (formData?: OmsorgspengesøknadFormData): StepConfigInterface => {
    let idx = 0;

    const config = {
        [StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER]: {
            ...getStepConfigItemTextKeys(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER),
            index: idx++,
            nextStep: StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE, // TODO: STEP 2 skal være HAR_UTBETALT_DE_TI_FØRSTE_DAGENE
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
        },
        [StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE]: {
            ...getStepConfigItemTextKeys(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE),
            index: idx++,
            nextStep: StepID.PERIODE, // TODO: STEP 2 skal være HAR_UTBETALT_DE_TI_FØRSTE_DAGENE
            backLinkHref: getSøknadRoute(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER)
        },

        [StepID.PERIODE]: {
            ...getStepConfigItemTextKeys(StepID.PERIODE),
            index: idx++,
            nextStep: StepID.HVIS_UTENLANDSOPPHOLD, // TODO: conditional if hvis-utenlandsopphold.
            backLinkHref: getSøknadRoute(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE)
        },
        [StepID.HVIS_UTENLANDSOPPHOLD]: {
            ...getStepConfigItemTextKeys(StepID.HVIS_UTENLANDSOPPHOLD),
            index: idx++,
            nextStep: StepID.LEGEERKLÆRING,
            backLinkHref: getSøknadRoute(StepID.PERIODE)
        },

        [StepID.LEGEERKLÆRING]: {
            ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
            index: idx++,
            nextStep: StepID.INNTEKT,
            backLinkHref: getSøknadRoute(StepID.HVIS_UTENLANDSOPPHOLD) // TODO: conditional if hvis-utenlandsopphold.
        },

        [StepID.INNTEKT]: {
            ...getStepConfigItemTextKeys(StepID.INNTEKT),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING)
        },

        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.SUMMARY,
            backLinkHref: getSøknadRoute(StepID.HVIS_UTENLANDSOPPHOLD)
        },

        [StepID.SUMMARY]: {
            ...getStepConfigItemTextKeys(StepID.SUMMARY),
            index: idx++,
            backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
            nextButtonLabel: 'step.sendButtonLabel',
            nextButtonAriaLabel: 'step.sendButtonAriaLabel'
        }
    };

    return config;
};

export interface StepConfigProps {
    onValidSubmit: () => void;
    formValues: OmsorgspengesøknadFormData;
}

export const stepConfig: StepConfigInterface = getStepConfig();
