import { YesOrNo } from 'common/types/YesOrNo';
import { EgenutbetalingQuestions } from '../søknad/egenutbetaling-step/config';
import { SituasjonStepQuestions } from '../søknad/situasjon-step/config';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import {
    delvisFraværIsValid,
    harSpesifisertMinimumEnPeriode,
    oppholdIsValid,
    perioderIsValid
} from '../søknad/periode-step/periodeStepConfig';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const situasjonStepIsValid = (values: SøknadFormData): boolean => {
    return SituasjonStepQuestions.getVisbility(values).areAllQuestionsAnswered();
};

export const egenutbetalingIsValid = (values: SøknadFormData) => {
    return EgenutbetalingQuestions.getVisbility(values).areAllQuestionsAnswered();
};

export const periodeStepIsValid = (formData: SøknadFormData) => {
    const harPerioderMedFravær: YesOrNo = formData[SøknadFormField.harPerioderMedFravær];
    const perioderMedFravær: Periode[] = formData[SøknadFormField.perioderMedFravær];
    const harDagerMedDelvisFravær: YesOrNo = formData[SøknadFormField.harDagerMedDelvisFravær];
    const dagerMedDelvisFravær: FraværDelerAvDag[] = formData[SøknadFormField.dagerMedDelvisFravær];
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioder_harVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioder_utenlandsopphold];

    const isValid: boolean = !!(
        perioderIsValid(harPerioderMedFravær, perioderMedFravær) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, dagerMedDelvisFravær) &&
        oppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
        harSpesifisertMinimumEnPeriode(perioderMedFravær, dagerMedDelvisFravær)
    );
    return isValid;
};

export const inntektStepIsValid = ({}: SøknadFormData) => {
    return true; // TODO: Spesifisere valideringsregler
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
