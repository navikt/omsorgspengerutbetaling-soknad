import { Næringstype } from '@navikt/sif-common-forms/lib';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';
import { Fosterbarn } from './SøknadFormData';

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
    erEØSLand: boolean;
}

export type YesNoSvar = boolean;

export type Spørsmål = string;

export interface YesNoSpørsmålOgSvar {
    spørsmål: Spørsmål;
    svar: YesNoSvar;
}

export interface Utbetalingsperiode {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    lengde?: string; // f eks PT5H30M | "null" (type Duration)
}

export interface UtbetalingsperiodeMedVedlegg extends Utbetalingsperiode {
    legeerklæringer: string[];
}

export interface Frilans {
    startdato: string;
    jobberFortsattSomFrilans: boolean;
}

export interface VirksomhetApiData {
    næringstyper: Næringstype[];
    fiskerErPåBladB?: boolean;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate | null;
    næringsinntekt?: number;
    navnPåVirksomheten: string;
    organisasjonsnummer?: string;
    registrertINorge: boolean;
    registrertILand?: string;
    yrkesaktivSisteTreFerdigliknedeÅrene?: {
        oppstartsdato: ApiStringDate;
    };
    varigEndring?: {
        dato: ApiStringDate;
        inntektEtterEndring: number;
        forklaring: string;
    };
    regnskapsfører?: {
        navn: string;
        telefon: string;
    };
    revisor?: {
        navn: string;
        telefon: string;
        kanInnhenteOpplysninger?: boolean;
    };
}

export interface SøknadApiData {
    språk: Locale;
    bekreftelser: {
        harBekreftetOpplysninger: boolean;
        harForståttRettigheterOgPlikter: boolean;
    };
    spørsmål: YesNoSpørsmålOgSvar[];
    fosterbarn?: Fosterbarn[];
    utbetalingsperioder: Utbetalingsperiode[]; // perioder
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    frilans?: Frilans;
    selvstendigVirksomheter: VirksomhetApiData[];
}
