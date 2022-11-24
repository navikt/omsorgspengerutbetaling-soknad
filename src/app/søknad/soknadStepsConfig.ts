import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';
import { SøknadFormData } from '../types/SøknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export enum StepID {
    'DINE_BARN' = 'dine-barn',
    'FRAVÆR' = 'fravaer',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
    'DOKUMENTER_LEGEERKLÆRING' = 'vedlegg_legeerklæring',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'FRAVÆR_FRA' = 'fravaerFra',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

interface ConfigStepHelperType {
    stepID: StepID;
    included: boolean;
}

const getSoknadSteps = (values: SøknadFormData): StepID[] => {
    const erFrilanser = values?.frilans_erFrilanser === YesOrNo.YES;
    const erSelvstendigNæringsdrivende = values?.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
    const skalViseFraværFraSteg = erFrilanser && erSelvstendigNæringsdrivende;

    const skalViseStengtSkoleBhgDokumenterStep = harFraværPgaStengBhgSkole(
        values?.fraværPerioder || [],
        values?.fraværDager || []
    );
    const skalViseSmittevernDokumenterStep = harFraværPgaSmittevernhensyn(
        values?.fraværPerioder || [],
        values?.fraværDager || []
    );

    const allSteps: ConfigStepHelperType[] = [
        { stepID: StepID.DINE_BARN, included: true },
        { stepID: StepID.FRAVÆR, included: true },
        { stepID: StepID.DOKUMENTER_STENGT_SKOLE_BHG, included: skalViseStengtSkoleBhgDokumenterStep },
        { stepID: StepID.DOKUMENTER_SMITTEVERNHENSYN, included: skalViseSmittevernDokumenterStep },
        { stepID: StepID.DOKUMENTER_LEGEERKLÆRING, included: true },
        { stepID: StepID.ARBEIDSSITUASJON, included: true },
        { stepID: StepID.FRAVÆR_FRA, included: skalViseFraværFraSteg },
        { stepID: StepID.MEDLEMSKAP, included: true },
        { stepID: StepID.OPPSUMMERING, included: true },
    ];

    const steps: StepID[] = allSteps.filter((step) => step.included === true).map((step) => step.stepID);

    return steps;
};

export const getSoknadStepsConfig = (values: SøknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.SOKNAD);
