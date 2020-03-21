import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import moment from 'moment';
import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // STEG 1: Kvalifisering
    tre_eller_fler_barn = 'tre_eller_fler_barn',
    alene_om_omsorg_for_barn = 'alene_om_omsorg_for_barn',
    rett_til_mer_enn_ti_dager_totalt = 'rett_til_mer_enn_ti_dager_totalt',
    den_andre_forelderen_ikke_kan_ta_seg_av_barnet = 'den_andre_forelderen_ikke_kan_ta_seg_av_barnet',
    har_barn_som_har_kronisk_sykdom_eller_funksjonshemming = 'har_barn_som_har_kronisk_sykdom_eller_funksjonshemming',

    // STEG 2: Har betalt ut 10 første dager
    har_utbetalt_ti_dager = 'har_utbetalt_ti_dager',
    innvilget_rett_og_ingen_andre_barn_under_tolv = 'innvilget_rett_og_ingen_andre_barn_under_tolv',
    fisker_på_blad_B = 'fisker_på_blad_B',
    frivillig_forsikring = 'frivillig_forsikring',
    nettop_startet_selvstendig_frilanser = 'nettop_startet_selvstendig_frilanser',

    // STEG 3: Periode
    harPerioderMedFravær = 'harPerioderMedFravær',
    perioderMedFravær = 'perioderMedFravær',
    perioderMedFraværGroup = 'perioderMedFraværGroup',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    dagerMedDelvisFravær = 'dagerMedDelvisFravær',
    dagerMedDelvisFraværGroup = 'dagerMedDelvisFraværGroup',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',

    // STEG 4: Conditional perioder i utlandet
    hvis_utenlandsopphold_en_test_verdi = 'hvis_utenlandsopphold_en_test_verdi',

    // STEG 5: Legeerklæring
    legeerklæring = 'legeerklæring',

    // STEG 6: Inntekt
    frilans_harHattInntektSomFrilanser = 'frilans_harHattInntektSomFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_virksomheter = 'selvstendig_virksomheter',

    // STEG 7: Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd'
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // STEG 1: Kvalifisering
    [SøknadFormField.tre_eller_fler_barn]: YesOrNo;
    [SøknadFormField.alene_om_omsorg_for_barn]: YesOrNo;
    [SøknadFormField.rett_til_mer_enn_ti_dager_totalt]: YesOrNo;
    [SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet]: YesOrNo;
    [SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming]: YesOrNo;

    // STEG 2: Har betalt ut 10 første dager
    [SøknadFormField.har_utbetalt_ti_dager]: YesOrNo;
    [SøknadFormField.innvilget_rett_og_ingen_andre_barn_under_tolv]: YesOrNo;
    [SøknadFormField.fisker_på_blad_B]: YesOrNo;
    [SøknadFormField.frivillig_forsikring]: YesOrNo;
    [SøknadFormField.nettop_startet_selvstendig_frilanser]: YesOrNo;

    // STEG 3: Periode

    [SøknadFormField.harPerioderMedFravær]: YesOrNo;
    [SøknadFormField.perioderMedFravær]: Periode[];
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo;
    [SøknadFormField.dagerMedDelvisFravær]: FraværDelerAvDag[];
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];

    // STEG 4: Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo;

    // STEG 5: Legeerklæring
    [SøknadFormField.legeerklæring]: Attachment[];

    // STEG 6: Inntekt
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo;
    [SøknadFormField.frilans_startdato]?: Date;
    [SøknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SøknadFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [SøknadFormField.selvstendig_virksomheter]?: Virksomhet[];

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}
// const mockPeriode = { fom: undefined, tom: undefined } as any;

// const ugyldigTimer: any = 'x';
export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // STEG 1: Kvalifisering
    [SøknadFormField.tre_eller_fler_barn]: YesOrNo.UNANSWERED,
    [SøknadFormField.alene_om_omsorg_for_barn]: YesOrNo.UNANSWERED,
    [SøknadFormField.rett_til_mer_enn_ti_dager_totalt]: YesOrNo.UNANSWERED,
    [SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet]: YesOrNo.UNANSWERED,
    [SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming]: YesOrNo.UNANSWERED,

    // STEG 2: Har betalt ut 10 første dager
    [SøknadFormField.har_utbetalt_ti_dager]: YesOrNo.UNANSWERED,
    [SøknadFormField.innvilget_rett_og_ingen_andre_barn_under_tolv]: YesOrNo.UNANSWERED,
    [SøknadFormField.fisker_på_blad_B]: YesOrNo.UNANSWERED,
    [SøknadFormField.frivillig_forsikring]: YesOrNo.UNANSWERED,
    [SøknadFormField.nettop_startet_selvstendig_frilanser]: YesOrNo.UNANSWERED,

    // STEG 3: Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderMedFravær]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.dagerMedDelvisFravær]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],

    // STEG 4: Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo.UNANSWERED,

    // STEG 5: Legeerklæring
    [SøknadFormField.legeerklæring]: [],

    // STEG 6: Inntekt
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};
