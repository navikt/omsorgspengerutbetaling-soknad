import { Arbeidstype, InntektsendringGruppe, InntektsendringSkjema } from './types';

export const getInntektsendringSkjemaByArbeidstype = (
    inntektsendringGruppe: InntektsendringGruppe,
    arbeidstype: Arbeidstype
): InntektsendringSkjema => {
    switch (arbeidstype) {
        case Arbeidstype.frilans:
            return inntektsendringGruppe[Arbeidstype.frilans];
        case Arbeidstype.selvstendig:
            return inntektsendringGruppe[Arbeidstype.selvstendig];
    }
};
