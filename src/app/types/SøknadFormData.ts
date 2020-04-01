import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // Periode
    harPerioderMedFravær = 'harPerioderMedFravær',
    perioderMedFravær = 'perioderMedFravær',
    perioderMedFraværGroup = 'perioderMedFraværGroup',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    dagerMedDelvisFravær = 'dagerMedDelvisFravær',
    dagerMedDelvisFraværGroup = 'dagerMedDelvisFraværGroup',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',

    // Conditional perioder i utlandet
    hvis_utenlandsopphold_en_test_verdi = 'hvis_utenlandsopphold_en_test_verdi',

    // Inntekt
    frilans_harHattInntektSomFrilanser = 'frilans_harHattInntektSomFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_virksomheter = 'selvstendig_virksomheter',
    er_arbeidstaker = 'er_arbeidstaker',

    // Barn
    har_fosterbarn = 'har_fosterbarn',
    fosterbarn = 'fosterbarn',
    har_fått_ekstra_omsorgsdager = 'har_fått_ekstra_omsorgsdager',

    // Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd'
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo;
    [SøknadFormField.perioderMedFravær]: Periode[];
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo;
    [SøknadFormField.dagerMedDelvisFravær]: FraværDelerAvDag[];
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];

    // Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo;

    // Inntekt
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo;
    [SøknadFormField.frilans_startdato]?: Date;
    [SøknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SøknadFormField.selvstendig_harHattInntektSomSN]: YesOrNo;
    [SøknadFormField.selvstendig_virksomheter]?: Virksomhet[];
    [SøknadFormField.er_arbeidstaker]: YesOrNo;

    // Barn
    [SøknadFormField.har_fosterbarn]: YesOrNo;
    [SøknadFormField.fosterbarn]: Fosterbarn[];
    [SøknadFormField.har_fått_ekstra_omsorgsdager]: YesOrNo;

    // Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}

export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderMedFravær]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.dagerMedDelvisFravær]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],

    // Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo.UNANSWERED,

    // Inntekt
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
    [SøknadFormField.er_arbeidstaker]: YesOrNo.UNANSWERED,

    // Kvalifisering
    [SøknadFormField.har_fosterbarn]: YesOrNo.UNANSWERED,
    [SøknadFormField.fosterbarn]: [],
    [SøknadFormField.har_fått_ekstra_omsorgsdager]: YesOrNo.UNANSWERED,

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};
