import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
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

const shouldIncludeHvisUtenlandsopphold = (formData?: SøknadFormData): boolean => {
    return !!(formData && formData[SøknadFormField.periode_har_vært_i_utlandet] === YesOrNo.YES);
};

export const getStepConfig = (formData?: SøknadFormData): StepConfigInterface => {
    let idx = 0;

    const showHvisUtenlandopphold = shouldIncludeHvisUtenlandsopphold(formData);

    let config = {
        [StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER]: {
            ...getStepConfigItemTextKeys(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER),
            index: idx++,
            nextStep: StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
        },
        [StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE]: {
            ...getStepConfigItemTextKeys(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE),
            index: idx++,
            nextStep: StepID.PERIODE,
            backLinkHref: getSøknadRoute(StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER)
        },
        [StepID.PERIODE]: {
            ...getStepConfigItemTextKeys(StepID.PERIODE),
            index: idx++,
            nextStep: showHvisUtenlandopphold ? StepID.HVIS_UTENLANDSOPPHOLD : StepID.LEGEERKLÆRING, // TODO: conditional if hvis-utenlandsopphold.
            backLinkHref: getSøknadRoute(StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE)
        }
    };

    if (showHvisUtenlandopphold) {
        config[StepID.HVIS_UTENLANDSOPPHOLD] = {
            ...getStepConfigItemTextKeys(StepID.HVIS_UTENLANDSOPPHOLD),
            index: idx++,
            nextStep: StepID.LEGEERKLÆRING,
            backLinkHref: getSøknadRoute(StepID.PERIODE)
        };
    }

    config = {
        ...config,
        ...{
            [StepID.LEGEERKLÆRING]: {
                ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
                index: idx++,
                nextStep: StepID.INNTEKT,
                backLinkHref: showHvisUtenlandopphold
                    ? getSøknadRoute(StepID.HVIS_UTENLANDSOPPHOLD)
                    : getSøknadRoute(StepID.PERIODE)
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
                backLinkHref: getSøknadRoute(StepID.INNTEKT)
            },
            [StepID.SUMMARY]: {
                ...getStepConfigItemTextKeys(StepID.SUMMARY),
                index: idx++,
                backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
                nextButtonLabel: 'step.sendButtonLabel',
                nextButtonAriaLabel: 'step.sendButtonAriaLabel'
            }
        }
    };

    return config;
};

export interface StepConfigProps {
    onValidSubmit: () => void;
    formValues: SøknadFormData;
}

export const stepConfig: StepConfigInterface = getStepConfig();
