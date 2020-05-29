import { YesOrNo } from 'common/types/YesOrNo';
import { BarnStepQuestions } from '../søknad/barn-step/config';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { Utenlandsopphold, Virksomhet } from '@navikt/sif-common-forms/lib';
import {
    delvisFraværIsValid,
    minimumEnUtbetalingsperiode,
    oppholdIsValid,
    perioderIsValid
} from '../søknad/periode-step/periodeStepConfig';
import { frilansIsValid, selvstendigIsValid } from '../søknad/inntekt-step/inntektStepConfig';
import { inntektsendringGruppeIsValid } from '../components/inntektsendring/inntektsendringValidation';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

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
        minimumEnUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær)
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
        selvstendigIsValid(selvstendigHarHattInntektSomSN, selvstendigVirksomheter) &&
        inntektsendringGruppeIsValid(
            formData.inntektsendring,
            formData.perioderMedFravær,
            formData.dagerMedDelvisFravær,
            frilansHarHattInntektSomFrilanser,
            formData.selvstendig_virksomheter || []
        );
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
