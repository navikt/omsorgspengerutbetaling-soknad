import {Endring, InntektsendringGruppe, InntektsendringSkjema} from './types';
import {YesOrNo} from '@navikt/sif-common-formik/lib';

export const initialEndring: Partial<Endring> = {
    dato: undefined,
    forklaring: ''
};

export const initialInntektsendringSkjema: InntektsendringSkjema = {
    harHattEndring: YesOrNo.UNANSWERED,
    endringer: []
};

export const mockInitialInntektsendringSkjema: InntektsendringSkjema = {
    harHattEndring: YesOrNo.YES,
    endringer: [
        {
            dato: new Date('2020-05-25'),
            forklaring: "Forklaring nummer 1"
        },
        {
            dato: new Date('2020-05-26'),
            forklaring: "Forklaring nummer 2"
        }
    ]
};

export const initialInntektsendringGruppe: InntektsendringGruppe = {
    frilans: mockInitialInntektsendringSkjema,
    selvstendig: initialInntektsendringSkjema
};
