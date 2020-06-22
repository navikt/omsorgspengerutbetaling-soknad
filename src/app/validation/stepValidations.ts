import {YesOrNo} from 'common/types/YesOrNo';
import {BarnStepQuestions} from '../søknad/barn-step/config';
import {SøknadFormData, SøknadFormField} from '../types/SøknadFormData';
import {Utenlandsopphold, Virksomhet} from '@navikt/sif-common-forms/lib';
import {
    delvisFraværIsValid,
    minimumEnUtbetalingsperiode,
    oppholdIsValid,
    perioderIsValid
} from '../søknad/periode-step/periodeStepConfig';
import {frilansIsValid, selvstendigIsValid} from '../søknad/inntekt-step/inntektStepConfig';
import {FraværDag, FraværPeriode} from "@navikt/sif-common-forms/lib/fravær";

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const periodeStepIsValid = (formData: SøknadFormData) => {
    const harPerioderMedFravær: YesOrNo = formData[SøknadFormField.harPerioderMedFravær];
    const fraværPerioder: FraværPeriode[] = formData.fraværPerioder;
    const harDagerMedDelvisFravær: YesOrNo = formData[SøknadFormField.harDagerMedDelvisFravær];
    const fraværDager: FraværDag[] = formData.fraværDager;
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioder_harVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioder_utenlandsopphold];

    const isValid: boolean = !!(
        perioderIsValid(harPerioderMedFravær, fraværPerioder) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, fraværDager) &&
        oppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
        minimumEnUtbetalingsperiode(fraværPerioder, fraværDager)
    );
    return isValid;
};

export const inntektStepIsValid = (formData: SøknadFormData) => {
    const frilansHarHattInntektSomFrilanser: YesOrNo = formData[SøknadFormField.frilans_harHattInntektSomFrilanser];
    const frilansStartdato: Date | undefined = formData[SøknadFormField.frilans_startdato];
    const frilansJobberFortsattSomFrilans: YesOrNo | undefined =
        formData[SøknadFormField.frilans_jobberFortsattSomFrilans];
    const selvstendigHarHattInntektSomSN: YesOrNo | undefined =
        formData[SøknadFormField.selvstendig_harHattInntektSomSN];
    const selvstendigVirksomheter: Virksomhet[] | undefined = formData[SøknadFormField.selvstendig_virksomheter];

    const isValid: boolean =
        frilansIsValid(frilansHarHattInntektSomFrilanser, frilansStartdato, frilansJobberFortsattSomFrilans) &&
        selvstendigIsValid(selvstendigHarHattInntektSomSN, selvstendigVirksomheter);
    // && minimumEnVirksomhet(frilansJobberFortsattSomFrilans, selvstendigVirksomheter)
    return isValid;
};

export const barnStepIsValid = (values: SøknadFormData): boolean => {
    return BarnStepQuestions.getVisbility(values).areAllQuestionsAnswered();
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
