export interface BarnResponse {
    barn: Barn[]
}

export interface Barn {
    /**
     * En dato med formatet YYYY-MM-DD.
     */
    fødselsdato: string;
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    aktørId: string;
}
