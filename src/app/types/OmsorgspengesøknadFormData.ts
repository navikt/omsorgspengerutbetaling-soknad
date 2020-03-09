import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { Attachment } from 'common/types/Attachment';
import { YesOrNo } from 'common/types/YesOrNo';
import { Virksomhet } from 'common/forms';

export enum Omsorgssituasjon {
    'tre_eller_flere_barn' = 'tre_eller_flere_barn',
    'alene_om_omsorg_for_barn' = 'alene_om_omsorg_for_barn',
    'fått_overført_dager_og_rett' = 'fått_overført_dager_og_rett',
    'innvilget_ekstra_dager_fordi_den_andre_forelderen_ikke_kan_ta_seg_av_barnet' = 'innvilget_ekstra_dager_fordi_den_andre_forelderen_ikke_kan_ta_seg_av_barnet',
    'innvilget_ekstra_dager_pga_kronisk_sykdom_funksjonshemming' = 'innvilget_ekstra_dager_pga_kronisk_sykdom_funksjonshemming'
}

export enum SøkersRelasjonTilBarnet {
    'MOR' = 'mor',
    'FAR' = 'far',
    'ADOPTIVFORELDER' = 'adoptivforelder',
    'FOSTERFORELDER' = 'fosterforelder'
}
export enum Arbeidssituasjon {
    'arbeidstaker' = 'arbeidstaker',
    'selvstendigNæringsdrivende' = 'selvstendigNæringsdrivende',
    'frilanser' = 'frilanser'
}

export enum AppFormField {
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

    // STEG 4: Conditional perioder i utlandet

    // STEG 5: Legeerklæring
    legeerklæring = 'legeerklæring',

    // STEG 6: Inntekt
    frilans_harHattInntektSomFrilanser = 'harHattInntektSomFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_virksomheter = 'selvstendig_virksomheter',

    // STEG 7: Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd'

    // TODO: Må gå over å se om noen av disse trengs
    // barnetHarIkkeFåttFødselsnummerEnda = 'barnetHarIkkeFåttFødselsnummerEnda',
    // barnetsNavn = 'barnetsNavn',
    // barnetsFødselsnummer = 'barnetsFødselsnummer',
    // barnetsFødselsdato = 'barnetsFødselsdato',
    // barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    // søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    // søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    // arbeidssituasjon = 'arbeidssituasjon',
    // erYrkesaktiv = 'erYrkesaktiv',
    // kroniskEllerFunksjonshemming = 'kroniskEllerFunksjonshemming',
    // sammeAdresse = 'sammeAdresse',
    // samværsavtale = 'samværsavtale'
}

export interface OmsorgspengesøknadFormData {
    [AppFormField.harForståttRettigheterOgPlikter]: boolean;
    [AppFormField.harBekreftetOpplysninger]: boolean;

    // STEG 1: Kvalifisering
    [AppFormField.tre_eller_fler_barn]: YesOrNo;
    [AppFormField.alene_om_omsorg_for_barn]: YesOrNo;
    [AppFormField.rett_til_mer_enn_ti_dager_totalt]: YesOrNo;
    [AppFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet]: YesOrNo;
    [AppFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming]: YesOrNo;

    // STEG 2: Har betalt ut 10 første dager
    [AppFormField.har_utbetalt_ti_dager]: YesOrNo;
    [AppFormField.innvilget_rett_og_ingen_andre_barn_under_tolv]: YesOrNo;
    [AppFormField.fisker_på_blad_B]: YesOrNo;
    [AppFormField.frivillig_forsikring]: YesOrNo;
    [AppFormField.nettop_startet_selvstendig_frilanser]: YesOrNo;

    // STEG 3: Periode

    // STEG 4: Conditional perioder i utlandet

    // STEG 5: Legeerklæring
    [AppFormField.legeerklæring]: Attachment[];

    // STEG 6: Inntekt
    [AppFormField.frilans_harHattInntektSomFrilanser]: YesOrNo;
    [AppFormField.frilans_startdato]?: Date;
    [AppFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [AppFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [AppFormField.selvstendig_virksomheter]?: Virksomhet[];

    // STEG 7: Medlemskap
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [AppFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [AppFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];

    // TODO: Må gå over å sjekke hvilke som trengs
    // [AppFormField.erYrkesaktiv]: YesOrNo;
    // [AppFormField.kroniskEllerFunksjonshemming]: YesOrNo;
    // [AppFormField.barnetsNavn]: string;
    // [AppFormField.barnetsFødselsnummer]: string;
    // [AppFormField.søkersRelasjonTilBarnet]?: SøkersRelasjonTilBarnet;
    // [AppFormField.søknadenGjelderEtAnnetBarn]: boolean;
    // [AppFormField.barnetSøknadenGjelder]: string;
    // [AppFormField.sammeAdresse]?: YesOrNo;
    // [AppFormField.arbeidssituasjon]: Arbeidssituasjon[];
    // [AppFormField.barnetHarIkkeFåttFødselsnummerEnda]: boolean;
    // [AppFormField.barnetsFødselsdato]?: Date;
    // [AppFormField.samværsavtale]?: Attachment[];
}

export const initialValues: OmsorgspengesøknadFormData = {
    [AppFormField.harForståttRettigheterOgPlikter]: false,
    [AppFormField.harBekreftetOpplysninger]: false,

    // STEG 1: Kvalifisering
    [AppFormField.tre_eller_fler_barn]: YesOrNo.UNANSWERED,
    [AppFormField.alene_om_omsorg_for_barn]: YesOrNo.UNANSWERED,
    [AppFormField.rett_til_mer_enn_ti_dager_totalt]: YesOrNo.UNANSWERED,
    [AppFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet]: YesOrNo.UNANSWERED,
    [AppFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming]: YesOrNo.UNANSWERED,

    // STEG 2: Har betalt ut 10 første dager
    [AppFormField.har_utbetalt_ti_dager]: YesOrNo.UNANSWERED,
    [AppFormField.innvilget_rett_og_ingen_andre_barn_under_tolv]: YesOrNo.UNANSWERED,
    [AppFormField.fisker_på_blad_B]: YesOrNo.UNANSWERED,
    [AppFormField.frivillig_forsikring]: YesOrNo.UNANSWERED,
    [AppFormField.nettop_startet_selvstendig_frilanser]: YesOrNo.UNANSWERED,

    // STEG 3: Periode

    // STEG 4: Conditional perioder i utlandet

    // STEG 5: Legeerklæring
    [AppFormField.legeerklæring]: [],

    // STEG 6: Inntekt
    [AppFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,

    // STEG 7: Medlemskap
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdNeste12Mnd]: []

    // TODO: Må gå over å sjekke hvilke som trengs

    // [AppFormField.erYrkesaktiv]: YesOrNo.YES,
    // [AppFormField.kroniskEllerFunksjonshemming]: YesOrNo.UNANSWERED,

    // [AppFormField.barnetsNavn]: '',
    // [AppFormField.barnetsFødselsnummer]: '',
    // [AppFormField.barnetSøknadenGjelder]: '',
    // [AppFormField.søkersRelasjonTilBarnet]: undefined,
    // [AppFormField.søknadenGjelderEtAnnetBarn]: false,

    // [AppFormField.arbeidssituasjon]: [],
    // [AppFormField.samværsavtale]: [],
    // [AppFormField.barnetHarIkkeFåttFødselsnummerEnda]: false,
    // [AppFormField.barnetsFødselsdato]: undefined,
};
