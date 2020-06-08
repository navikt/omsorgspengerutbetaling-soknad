import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoIsAnswered';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

const Q = SøknadFormField;

const PeriodeStepConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.harPerioderMedFravær]: {
        isAnswered: ({ harPerioderMedFravær }) => yesOrNoIsAnswered(harPerioderMedFravær)
    },
    [Q.perioderMedFravær]: {
        parentQuestion: Q.harPerioderMedFravær,
        isIncluded: ({ harPerioderMedFravær }) => harPerioderMedFravær === YesOrNo.NO,
        isAnswered: ({ perioderMedFravær }) => perioderMedFravær.length > 0
    }
};

export const PeriodeStepQuestions = Questions<SøknadFormData, SøknadFormField>(PeriodeStepConfig);

export const perioderIsValid = (harPerioderMedFravær: YesOrNo, perioderMedFravær: FraværPeriode[]): boolean =>
    harPerioderMedFravær === YesOrNo.NO || (harPerioderMedFravær === YesOrNo.YES && perioderMedFravær.length > 0);

export const delvisFraværIsValid = (harDagerMedDelvisFravær: YesOrNo, dagerMedDelvisFravær: FraværDag[]): boolean =>
    harDagerMedDelvisFravær === YesOrNo.NO ||
    (harDagerMedDelvisFravær === YesOrNo.YES && dagerMedDelvisFravær.length > 0);

export const oppholdIsValid = (
    perioderHarVærtIUtlandet: YesOrNo,
    perioderUtenlandsopphold: Utenlandsopphold[]
): boolean =>
    perioderHarVærtIUtlandet === YesOrNo.NO ||
    (perioderHarVærtIUtlandet === YesOrNo.YES && perioderUtenlandsopphold.length > 0);

export const minimumEnUtbetalingsperiode = (
    perioderMedFravær: FraværPeriode[],
    dagerMedDelvisFravær: FraværDag[]
): boolean => perioderMedFravær.length > 0 || dagerMedDelvisFravær.length > 0;
