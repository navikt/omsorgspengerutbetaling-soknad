import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../types/SøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'PERIODE' = 'periode',
    'FRAVÆR' = 'fravaer',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'BARN' = 'barn',
    'LEGEERKLÆRING' = 'legeerklaering',
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

    const getNextStepAfterFraværStep = (): StepID => {
        if (skalViseStengtSkoleBhgDokumenterStep) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        if (skalViseSmittevernDokumenterStep) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        return StepID.ARBEIDSSITUASJON;
    };

    const getPrevioustStepForInntektStep = (): StepID => {
        if (skalViseSmittevernDokumenterStep) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        if (skalViseStengtSkoleBhgDokumenterStep) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        return StepID.FRAVÆR;
    };

    const configDelEn = {
        [StepID.PERIODE]: {
            ...getStepConfigItemTextKeys(StepID.PERIODE),
            index: idx++,
            nextStep: StepID.FRAVÆR,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
        [StepID.FRAVÆR]: {
            ...getStepConfigItemTextKeys(StepID.FRAVÆR),
            index: idx++,
            nextStep: getNextStepAfterFraværStep(),
            backLinkHref: getSøknadRoute(StepID.PERIODE),
        },
    };

    const configDokumentStengtBhgSkole = skalViseStengtSkoleBhgDokumenterStep
        ? {
              [StepID.DOKUMENTER_STENGT_SKOLE_BHG]: {
                  ...getStepConfigItemTextKeys(StepID.DOKUMENTER_STENGT_SKOLE_BHG),
                  index: idx++,
                  nextStep: skalViseSmittevernDokumenterStep
                      ? StepID.DOKUMENTER_SMITTEVERNHENSYN
                      : StepID.ARBEIDSSITUASJON,
                  backLinkHref: getSøknadRoute(StepID.FRAVÆR),
              },
          }
        : undefined;

    const configDokumentSmittevernhensynSteg = skalViseSmittevernDokumenterStep
        ? {
              [StepID.DOKUMENTER_SMITTEVERNHENSYN]: {
                  ...getStepConfigItemTextKeys(StepID.DOKUMENTER_SMITTEVERNHENSYN),
                  index: idx++,
                  nextStep: StepID.ARBEIDSSITUASJON,
                  backLinkHref: skalViseStengtSkoleBhgDokumenterStep
                      ? getSøknadRoute(StepID.DOKUMENTER_STENGT_SKOLE_BHG)
                      : getSøknadRoute(StepID.FRAVÆR),
              },
          }
        : undefined;

    const configDelTo = {
        [StepID.ARBEIDSSITUASJON]: {
            ...getStepConfigItemTextKeys(StepID.ARBEIDSSITUASJON),
            index: idx++,
            nextStep: StepID.BARN,
            backLinkHref: getPrevioustStepForInntektStep(),
        },
        [StepID.BARN]: {
            ...getStepConfigItemTextKeys(StepID.BARN),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.ARBEIDSSITUASJON),
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
