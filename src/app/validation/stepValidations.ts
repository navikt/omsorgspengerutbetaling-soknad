import { YesOrNo } from 'common/types/YesOrNo';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: OmsorgspengesøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const nårKanManFåUtbetaltOmsorgspengerPageIsValid = ({
    tre_eller_fler_barn,
    alene_om_omsorg_for_barn,
    rett_til_mer_enn_ti_dager_totalt,
    den_andre_forelderen_ikke_kan_ta_seg_av_barnet,
    har_barn_som_har_kronisk_sykdom_eller_funksjonshemming
}: OmsorgspengesøknadFormData): boolean => {
    return true; // TODO: Har vi noen valideringskrav?
};

export const harUtbetaltDeFørsteTiDagenePageIsValid = ({
    har_utbetalt_ti_dager,
    innvilget_rett_og_ingen_andre_barn_under_tolv,
    fisker_på_blad_B,
    frivillig_forsikring,
    nettop_startet_selvstendig_frilanser
}: OmsorgspengesøknadFormData) => {
    return true; // TODO: Spesifisere valideringsregler
};

export const periodeStepIsValid = ({}: OmsorgspengesøknadFormData) => {
    return true; // TODO: Spesifisere valideringsregler
};

export const inntektStepIsValid = ({}: OmsorgspengesøknadFormData) => {
    return true; // TODO: Spesifisere valideringsregler
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: OmsorgspengesøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
