import {Arbeidstype, InntektsendringSkjemaFields} from "./types";

export const yesOrNoFormikName = (rootName: string, arbeidstype: Arbeidstype): string =>
    `${rootName}.${arbeidstype}.${InntektsendringSkjemaFields.harHattEndring}`;

export const endringslisteFormikName = (rootName: string, arbeidstype: Arbeidstype): string =>
    `${rootName}.${arbeidstype}.${InntektsendringSkjemaFields.endringer}`;
