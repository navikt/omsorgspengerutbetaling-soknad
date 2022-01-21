import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../types/SøknadFormData';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';
import { getSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'DINE_BARN' = 'dine-barn',
    'FRAVÆR' = 'fravaer',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'FRAVÆR_FRA' = 'fravaerFra',
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

    const erFrilanser = formData?.frilans_erFrilanser === YesOrNo.YES;
    const erSelvstendigNæringsdrivende = formData?.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;

    const skalViseFraværFraSteg = erFrilanser && erSelvstendigNæringsdrivende;

    const skalViseStengtSkoleBhgDokumenterStep = harFraværPgaStengBhgSkole(
        formData?.fraværPerioder || [],
        formData?.fraværDager || []
    );
    const skalViseSmittevernDokumenterStep = harFraværPgaSmittevernhensyn(
        formData?.fraværPerioder || [],
        formData?.fraværDager || []
    );

    const getNextStepAfterFraværStep = (): StepID => {
        if (skalViseStengtSkoleBhgDokumenterStep) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        if (skalViseSmittevernDokumenterStep) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        return StepID.ARBEIDSSITUASJON;
    };

    const getPrevioustStepForArbeidssituasjonStep = (): StepID => {
        if (skalViseSmittevernDokumenterStep) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        if (skalViseStengtSkoleBhgDokumenterStep) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        return StepID.FRAVÆR;
    };

    const configDelEn = {
        [StepID.DINE_BARN]: {
            ...getStepConfigItemTextKeys(StepID.DINE_BARN),
            index: idx++,
            nextStep: StepID.FRAVÆR,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
        [StepID.FRAVÆR]: {
            ...getStepConfigItemTextKeys(StepID.FRAVÆR),
            index: idx++,
            nextStep: getNextStepAfterFraværStep(),
            backLinkHref: getSøknadRoute(StepID.DINE_BARN),
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
            nextStep: skalViseFraværFraSteg ? StepID.FRAVÆR_FRA : StepID.MEDLEMSKAP,
            backLinkHref: getPrevioustStepForArbeidssituasjonStep(),
        },
        [StepID.FRAVÆR_FRA]: {
            ...getStepConfigItemTextKeys(StepID.FRAVÆR_FRA),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.ARBEIDSSITUASJON),
        },

        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.OPPSUMMERING,
            backLinkHref: getSøknadRoute(skalViseFraværFraSteg ? StepID.FRAVÆR_FRA : StepID.ARBEIDSSITUASJON),
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
