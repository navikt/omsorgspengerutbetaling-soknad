import { Næringstype } from '@navikt/sif-common-forms/lib';
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

export type YesNoSvar = boolean;

export type Spørsmål = string;

export interface YesNoSpørsmålOgSvar {
    spørsmål: Spørsmål;
    svar: YesNoSvar;
}

export interface UtbetalingsperiodeMedVedlegg {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    lengde?: string; // f eks PT5H30M | "null" (type Duration)
    legeerklæringer: string[];
}

export interface Frilans {
    startdato: string;
    jobberFortsattSomFrilans: boolean;
}

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
        erNarVennFamilie: boolean;
    };
}

export interface SøknadApiData {
    språk: Locale;
    bekreftelser: {
        harBekreftetOpplysninger: boolean;
        harForståttRettigheterOgPlikter: boolean;
    };
    spørsmål: YesNoSpørsmålOgSvar[];
    utbetalingsperioder: UtbetalingsperiodeMedVedlegg[]; // perioder
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    frilans?: Frilans;
    selvstendigVirksomheter: VirksomhetApiData[];
}
