export enum ResourceType {
    BARN = 'barn',
    SEND_SØKNAD = 'soknad',
    SØKER = 'soker',
    VEDLEGG = 'vedlegg',
    MELLOMLAGRING = 'mellomlagring',
}
export interface BarnRemoteData {
    barn: {
        fødselsdato: string;
        fornavn: string;
        mellomnavn: string | null;
        etternavn: string;
        aktørId: string;
    }[];
}
