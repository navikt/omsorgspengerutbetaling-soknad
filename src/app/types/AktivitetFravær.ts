export enum Aktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
    BEGGE = 'BEGGE',
}

export interface AktivitetFravær {
    dato: Date;
    aktivitet: Aktivitet;
}
