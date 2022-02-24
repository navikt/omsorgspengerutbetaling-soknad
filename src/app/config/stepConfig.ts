import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../types/SøknadFormData';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';
import { getSøknadRoute } from '../utils/routeUtils';

export enum StepID {
    'DINE_BARN' = 'dine-barn',
    'FRAVÆR' = 'fravaer',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'FRAVÆR_FRA' = 'fravaerFra',
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
    stepNumber: number;
    prevStep?: StepID;
    nextStep?: StepID;
    backLinkHref?: string;
    included: boolean;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        stepIndicatorLabel: `step.${stepId}.stepIndicatorLabel`,
        nextButtonLabel: stepId === StepID.OPPSUMMERING ? 'step.sendButtonLabel' : 'step.nextButtonLabel',
    };
};

interface ConfigStepHelperType {
    stepID: StepID;
    included: boolean;
}

export const getSøknadStepConfig = (formData?: SøknadFormData): StepConfigInterface => {
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

    const allSteps: ConfigStepHelperType[] = [
        { stepID: StepID.DINE_BARN, included: true },
        { stepID: StepID.FRAVÆR, included: true },
        { stepID: StepID.DOKUMENTER_STENGT_SKOLE_BHG, included: skalViseStengtSkoleBhgDokumenterStep },
        { stepID: StepID.DOKUMENTER_SMITTEVERNHENSYN, included: skalViseSmittevernDokumenterStep },
        { stepID: StepID.ARBEIDSSITUASJON, included: true },
        { stepID: StepID.FRAVÆR_FRA, included: skalViseFraværFraSteg },
        { stepID: StepID.MEDLEMSKAP, included: true },
        { stepID: StepID.OPPSUMMERING, included: true },
    ];

    const includedSteps = allSteps.filter((s) => s.included);

    const getNextStep = (stepID: StepID): StepID | undefined => {
        const idx = includedSteps.findIndex((s) => s.stepID === stepID);
        return idx > -1 && idx < includedSteps.length - 1 ? includedSteps[idx + 1].stepID : undefined;
    };

    const getPreviousStep = (stepID: StepID): StepID | undefined => {
        const idx = includedSteps.findIndex((s) => s.stepID === stepID);
        return idx >= 1 ? includedSteps[idx - 1].stepID : undefined;
    };

    const config: StepConfigInterface = {};
    let includedStepIdx = 0;
    allSteps.forEach(({ stepID, included }) => {
        const nextStep = getNextStep(stepID);
        const prevStep = getPreviousStep(stepID);
        const backLinkHref = prevStep ? getSøknadRoute(prevStep) : undefined;

        config[stepID] = {
            ...getStepConfigItemTextKeys(stepID),
            stepNumber: includedStepIdx,
            nextStep,
            prevStep,
            backLinkHref,
            included,
        };
        includedStepIdx = included ? includedStepIdx + 1 : includedStepIdx;
    });
    return config;
};

export const getBackLinkFromNotIncludedStep = (stepId: StepID): string | undefined => {
    if (stepId === StepID.DOKUMENTER_STENGT_SKOLE_BHG || stepId === StepID.DOKUMENTER_SMITTEVERNHENSYN) {
        return getSøknadRoute(StepID.FRAVÆR);
    }

    if (stepId === StepID.FRAVÆR_FRA) {
        return getSøknadRoute(StepID.ARBEIDSSITUASJON);
    }
    return undefined;
};
export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const søknadStepConfig: StepConfigInterface = getSøknadStepConfig();
