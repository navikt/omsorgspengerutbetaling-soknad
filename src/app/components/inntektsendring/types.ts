import { YesOrNo } from '@navikt/sif-common-formik/lib';

export enum Arbeidstype {
    frilans = 'frilans',
    selvstendig = 'selvstendig'
}

export interface Endring {
    dato: Date;
    forklaring: string;
}

export enum InntektsendringSkjemaFields {
    harHattEndring = 'harHattEndring',
    endringer = 'endringer'
}

export interface InntektsendringSkjema {
    [InntektsendringSkjemaFields.harHattEndring]: YesOrNo;
    [InntektsendringSkjemaFields.endringer]: Endring[];
}

export interface InntektsendringGruppe {
    [Arbeidstype.frilans]: InntektsendringSkjema;
    [Arbeidstype.selvstendig]: InntektsendringSkjema;
}
