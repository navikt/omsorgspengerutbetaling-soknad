export enum Aktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
    BEGGE = 'BEGGE',
}
export enum ApiAktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
}

export interface AktivitetFravær {
    dato: Date;
    aktivitet: Aktivitet;
}
