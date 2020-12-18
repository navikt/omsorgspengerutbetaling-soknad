import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData } from '../types/SøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'BARN' = 'barn',
    'PERIODE' = 'periode',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
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
    };
};

export const getStepConfig = (formData?: SøknadFormData): StepConfigInterface => {
    let idx = 0;

    const { hjemmePgaStengtBhgSkole, hjemmePgaSmittevernhensyn } = formData || {};
    const skalViseStengtSkoleBhgDokumenterStep = hjemmePgaStengtBhgSkole === YesOrNo.YES;
    const skalViseSmittevernDokumenterStep = hjemmePgaSmittevernhensyn === YesOrNo.YES;

    const getNextStepAfterPeriodeStep = (): StepID => {
        if (skalViseStengtSkoleBhgDokumenterStep) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        if (skalViseSmittevernDokumenterStep) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        return StepID.INNTEKT;
    };

    const getPrevioustStepForInntektStep = (): StepID => {
        if (skalViseSmittevernDokumenterStep) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        if (skalViseStengtSkoleBhgDokumenterStep) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        return StepID.PERIODE;
    };

    const configDelEn = {
        [StepID.PERIODE]: {
            ...getStepConfigItemTextKeys(StepID.PERIODE),
            index: idx++,
            nextStep: getNextStepAfterPeriodeStep(),
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
    };

    const configDokumentStengtBhgSkole = skalViseStengtSkoleBhgDokumenterStep
        ? {
              [StepID.DOKUMENTER_STENGT_SKOLE_BHG]: {
                  ...getStepConfigItemTextKeys(StepID.DOKUMENTER_STENGT_SKOLE_BHG),
                  index: idx++,
                  nextStep: skalViseSmittevernDokumenterStep ? StepID.DOKUMENTER_SMITTEVERNHENSYN : StepID.INNTEKT,
                  backLinkHref: getSøknadRoute(StepID.PERIODE),
              },
          }
        : undefined;

    const configDokumentSmittevernhensynSteg = skalViseSmittevernDokumenterStep
        ? {
              [StepID.DOKUMENTER_SMITTEVERNHENSYN]: {
                  ...getStepConfigItemTextKeys(StepID.DOKUMENTER_SMITTEVERNHENSYN),
                  index: idx++,
                  nextStep: StepID.INNTEKT,
                  backLinkHref: skalViseStengtSkoleBhgDokumenterStep
                      ? getSøknadRoute(StepID.DOKUMENTER_STENGT_SKOLE_BHG)
                      : getSøknadRoute(StepID.PERIODE),
              },
          }
        : undefined;

    const configDelTo = {
        [StepID.INNTEKT]: {
            ...getStepConfigItemTextKeys(StepID.INNTEKT),
            index: idx++,
            nextStep: StepID.BARN,
            backLinkHref: getPrevioustStepForInntektStep(),
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
        },
    };

    return {
        ...configDelEn,
        ...configDokumentStengtBhgSkole,
        ...configDokumentSmittevernhensynSteg,
        ...configDelTo,
    };
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}
