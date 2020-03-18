export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
    myndig: boolean;
}

export interface Søkerdata {
    person: Person;
}
