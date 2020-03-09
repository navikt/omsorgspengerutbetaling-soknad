import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    norskIdentifikator: string | null;
    aktørId: string | null;
    fødselsdato: ApiStringDate | null;
}

interface Medlemskap {
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

export interface OmsorgspengesøknadApiData {
    newVersion: boolean;
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    legeerklæring: string[];
    medlemskap: Medlemskap;
}
