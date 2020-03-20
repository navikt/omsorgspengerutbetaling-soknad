import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

export type ISO8601Duration = string;

export interface MedlemskapApiData {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: UtenlandsoppholdApiData[];
    utenlandsoppholdSiste12Mnd: UtenlandsoppholdApiData[];
}

export interface UtenlandsoppholdApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export enum SpørsmålId {
    HarBekreftetOpplysninger = "HarBekreftetOpplysninger",
    HarForståttRettigheterOgPlikter = "HarForståttRettigheterOgPlikter"
}

export enum Svar {
    Ja = "Ja",
    Nei = "Nei",
    VetIkke = "VetIkke"
}

export type Spørsmål = string
export type Fritekst = string

export interface SpørsmålOgSvar {
    id?: SpørsmålId;
    spørsmål: Spørsmål;
    svar: Svar;
    fritekst?: Fritekst;
}

export interface UtbetalingsperiodeMedVedlegg {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    lengde?: string; // f eks PT5H30M | "null" (type Duration)
    legeerklæringer: string[];
}

export interface BostedUtlandApiData {
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate;
    landkode: string;
    landnavn: string;
}

// TODO: Legge til frilans og selvstendig næringsdrivende når de er klare på backend.
export interface SøknadApiData {
    språk: Locale;
    spørsmål: SpørsmålOgSvar[];
    utbetalingsperioder: UtbetalingsperiodeMedVedlegg[]; // perioder
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
}
