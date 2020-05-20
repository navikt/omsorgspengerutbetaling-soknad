import { Endring, InntektsendringGruppe, InntektsendringSkjema } from './types';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const initialEndring: Partial<Endring> = {
    dato: undefined,
    forklaring: ''
};

export const initialInntektsendringSkjema: InntektsendringSkjema = {
    harHattEndring: YesOrNo.UNANSWERED,
    endringer: []
};

export const initialInntektsendringGruppe: InntektsendringGruppe = {
    frilans: initialInntektsendringSkjema,
    selvstendig: initialInntektsendringSkjema
};
