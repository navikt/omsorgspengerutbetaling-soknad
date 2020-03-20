import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';
import {Næringstype} from "@navikt/sif-common-forms/lib";

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

// data class Frilans(
// @JsonFormat(pattern = "yyyy-MM-dd")
// val startdato: LocalDate,
//     val jobberFortsattSomFrilans: Boolean
// )

export interface Frilans {
    startdato: string;
    jobberFortsattSomFrilans: boolean
}


// val naringstype: List<Naringstype>,
// val fiskerErPåBladB: Boolean? = null,
// @JsonFormat(pattern = "yyyy-MM-dd")
// val fraOgMed: LocalDate,
// val tilOgMed: LocalDate? = null,
// val erPagaende: Boolean,
// val naringsinntekt: Int? = null,
// val navnPaVirksomheten: String,
// val organisasjonsnummer: String? = null,
// val registrertINorge: Boolean,
// val registrertILand: String? = null,
// val harBlittYrkesaktivSisteTreFerdigliknendeArene: Boolean? = null,
// val yrkesaktivSisteTreFerdigliknedeArene: YrkesaktivSisteTreFerdigliknedeArene? = null,
// val harVarigEndringAvInntektSiste4Kalenderar: Boolean? = null,
// val varigEndring: VarigEndring? = null,
// val harRegnskapsforer: Boolean,
// val regnskapsforer: Regnskapsforer? = null,
// val harRevisor: Boolean? = null,
// val revisor: Revisor? = null

export interface VirksomhetApiData {
    naringstype: Næringstype[];
    fiskerErPåBladB?: boolean;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate | null;
    erPagaende?: boolean;
    naringsinntekt?: number;
    navnPaVirksomheten: string;
    organisasjonsnummer?: string;
    registrertINorge: boolean;
    registrertILand?: string;
    harBlittYrkesaktivSisteTreFerdigliknendeArene?: boolean;
    yrkesaktivSisteTreFerdigliknedeArene?: {
        oppstartsdato: ApiStringDate;
    };
    harVarigEndringAvInntektSiste4Kalenderar?: boolean;
    varigEndring?: {
        dato?: ApiStringDate | null;
        inntektEtterEndring?: number;
        forklaring?: string;
    };
    harRegnskapsforer: boolean;
    regnskapsforer?: {
        navn: string;
        telefon: string;
        erNarVennFamilie: boolean;
    };
    harRevisor?: boolean;
    revisor?: {
        navn: string;
        telefon: string;
        kanInnhenteOpplysninger?: boolean;
        erNarVennFamilie: boolean
    };
}

export interface SøknadApiData {
    språk: Locale;
    spørsmål: SpørsmålOgSvar[];
    utbetalingsperioder: UtbetalingsperiodeMedVedlegg[]; // perioder
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    frilans?: Frilans;
    selvstendigVirksomheter: VirksomhetApiData[]
}
