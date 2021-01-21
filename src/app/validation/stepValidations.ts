import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { Utenlandsopphold, Virksomhet } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { BarnStepQuestions } from '../søknad/barn-step/config';
import { frilansIsValid, selvstendigIsValid } from '../søknad/inntekt-step/inntektStepConfig';
import {
    delvisFraværIsValid,
    minimumEnUtbetalingsperiode,
    oppholdIsValid,
    perioderIsValid,
} from '../søknad/periode-step/periodeStepConfig';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const periodeStepIsValid = (formData: SøknadFormData): boolean => {
    const harPerioderMedFravær: YesOrNo = formData[SøknadFormField.harPerioderMedFravær];
    const fraværPerioder: FraværPeriode[] = formData.fraværPerioder;
    const harDagerMedDelvisFravær: YesOrNo = formData[SøknadFormField.harDagerMedDelvisFravær];
    const fraværDager: FraværDag[] = formData.fraværDager;
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioder_harVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioder_utenlandsopphold];

    const isValid = !!(
        perioderIsValid(harPerioderMedFravær, fraværPerioder) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, fraværDager) &&
        oppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
        minimumEnUtbetalingsperiode(fraværPerioder, fraværDager)
    );
    return isValid;
};

export const inntektStepIsValid = (formData: SøknadFormData): boolean => {
    const frilansHarHattInntektSomFrilanser: YesOrNo = formData[SøknadFormField.frilans_harHattInntektSomFrilanser];
    const frilansStartdato: string | undefined = formData[SøknadFormField.frilans_startdato];
    const frilansJobberFortsattSomFrilans: YesOrNo | undefined =
        formData[SøknadFormField.frilans_jobberFortsattSomFrilans];
    const selvstendigHarHattInntektSomSN: YesOrNo | undefined =
        formData[SøknadFormField.selvstendig_harHattInntektSomSN];
    const selvstendigVirksomheter: Virksomhet[] | undefined = formData[SøknadFormField.selvstendig_virksomheter];

    const isValid: boolean =
        frilansIsValid(
            frilansHarHattInntektSomFrilanser,
            datepickerUtils.getDateFromDateString(frilansStartdato),
            frilansJobberFortsattSomFrilans
        ) && selvstendigIsValid(selvstendigHarHattInntektSomSN, selvstendigVirksomheter);
    // && minimumEnVirksomhet(frilansJobberFortsattSomFrilans, selvstendigVirksomheter)
    return isValid;
};

export const barnStepIsValid = (values: SøknadFormData): boolean => {
    return BarnStepQuestions.getVisbility(values).areAllQuestionsAnswered();
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
