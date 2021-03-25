import { FraværÅrsak, VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { AndreUtbetalinger } from './AndreUtbetalinger';

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

export interface UtbetalingsperiodeApi {
    årsak: FraværÅrsak;
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    antallTimerBorte: string | null; // f eks PT5H30M | "null" (type Duration)
    antallTimerPlanlagt: string | null; // f eks PT5H30M | "null" (type Duration)
}

export interface Frilans {
    startdato: string;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: string;
}

export interface Land {
    landkode?: string;
    landnavn?: string;
}
export interface ApiFosterbarn {
    identitetsnummer?: string;
}

export interface SøknadApiData {
    språk: Locale;
    bekreftelser: {
        harBekreftetOpplysninger: boolean;
        harForståttRettigheterOgPlikter: boolean;
    };
    spørsmål: YesNoSpørsmålOgSvar[];
    fosterbarn?: ApiFosterbarn[];
    utbetalingsperioder: UtbetalingsperiodeApi[]; // perioder
    andreUtbetalinger: AndreUtbetalinger[];
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    frilans?: Frilans;
    selvstendigVirksomheter: VirksomhetApiData[];
    vedlegg: string[];
    _vedleggSmittevern: string[];
    _vedleggStengtSkole: string[];
    _harDekketTiFørsteDagerSelv: boolean;
    _harSøktAndreUtbetalinger: boolean;
    _harFosterbarn: boolean;
}
