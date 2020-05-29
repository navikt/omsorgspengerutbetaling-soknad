import { FraværDelerAvDag, Periode } from '../../../@types/omsorgspengerutbetaling-schema';
import { Arbeidstype, InntektsendringGruppe, InntektsendringSkjema, InntektsendringSkjemaFields } from './types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { harPerioderMedHopp } from './periodeUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const inntektsendringSkjemaIsValid = (inntektsendringSkjema: InntektsendringSkjema): boolean => {
    if (inntektsendringSkjema[InntektsendringSkjemaFields.harHattEndring] === YesOrNo.NO) {
        return true;
    }
    if (
        inntektsendringSkjema[InntektsendringSkjemaFields.harHattEndring] === YesOrNo.YES &&
        inntektsendringSkjema[InntektsendringSkjemaFields.endringer].length > 0
    ) {
        return true;
    }
    return false;
};

export const invalidInntektsendringSkjema = (inntektsendringSkjema: InntektsendringSkjema): boolean =>
    !inntektsendringSkjemaIsValid(inntektsendringSkjema);

export const inntektsendringGruppeIsValid = (
    inntektsendringGruppe: InntektsendringGruppe | undefined,
    perioder: Periode[],
    listeFraværDelerAvDag: FraværDelerAvDag[],
    harVærtFrilans: YesOrNo,
    virksomheter: Virksomhet[]
): boolean => {
    if (inntektsendringGruppe === undefined) {
        return true;
    }
    const harHopp = harPerioderMedHopp(perioder, listeFraværDelerAvDag);
    if (harHopp === false) {
        return true;
    }
    if (
        (harVærtFrilans === YesOrNo.YES && invalidInntektsendringSkjema(inntektsendringGruppe[Arbeidstype.frilans])) ||
        (virksomheter.length > 0 && invalidInntektsendringSkjema(inntektsendringGruppe[Arbeidstype.selvstendig]))
    ) {
        return false;
    }
    return true;
};
