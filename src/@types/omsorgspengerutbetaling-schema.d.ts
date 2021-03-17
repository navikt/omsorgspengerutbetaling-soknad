export interface BarnResponse {
    barn: Barn[];
}

export interface ListeAvBarn {
    barna: Barn[];
}

export interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: Date;
}

export type SokerBarnRelasjon =
    | 'mor'
    | 'far'
    | 'adoptivforelder'
    | 'samværsforelder'
    | 'steforelder'
    | 'fosterforelder';

export interface Soknad {
    nyVersjon: boolean;
    språk: 'nb' | 'nn';
    kroniskEllerFunksjonshemming: boolean;
    barn: BarnDetaljer;
    sammeAdresse: boolean | null;
    arbeidssituasjon: string[];
    medlemskap: Medlemskap;
    legeerklæring: string[];
    samværsavtale: string[] | null;
    relasjonTilBarnet: null | SokerBarnRelasjon;
    harBekreftetOpplysninger: boolean;
    harForståttRettigheterOgPlikter: boolean;
}
export interface BarnDetaljer {
    norskIdentifikator: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    navn: string | null;
}
export interface Medlemskap {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdSiste12Mnd: Utenlandsopphold[];
    utenlandsoppholdNeste12Mnd: Utenlandsopphold[];
}
export interface Utenlandsopphold {
    fraOgMed: string;
    tilOgMed: string;
    landkode: string;
    landnavn: string;
}

export interface Periode {
    fom: Date;
    tom: Date;
}

export interface FraværDelerAvDag {
    dato: Date;
    timer: number;
}
