import { YesOrNo } from 'common/types/YesOrNo';
import { Virksomhet } from '@navikt/sif-common-forms/lib';

export const frilansIsValid = (
    frilansHarHattInntektSomFrilanser: YesOrNo,
    frilansStartdato: Date | undefined,
    frilansJobberFortsattSomFrilans: YesOrNo | undefined
) => {
    return !!(
        frilansHarHattInntektSomFrilanser === YesOrNo.NO ||
        (frilansHarHattInntektSomFrilanser === YesOrNo.YES &&
            frilansStartdato &&
            frilansJobberFortsattSomFrilans &&
            (frilansJobberFortsattSomFrilans === YesOrNo.YES || frilansJobberFortsattSomFrilans === YesOrNo.NO))
    );
};

export const selvstendigIsValid = (
    selvstendigHarHattInntektSomSN: YesOrNo | undefined,
    selvstendigVirksomheter: Virksomhet[] | undefined
) => {
    return !!(
        selvstendigHarHattInntektSomSN === YesOrNo.NO ||
        (selvstendigHarHattInntektSomSN === YesOrNo.YES &&
            selvstendigVirksomheter &&
            selvstendigVirksomheter.length > 0)
    );
};

export const minimumEnVirksomhet = (
    frilansJobberFortsattSomFrilans: YesOrNo | undefined,
    selvstendigVirksomheter: Virksomhet[] | undefined
) => {
    return !!(
        frilansJobberFortsattSomFrilans === YesOrNo.YES ||
        (selvstendigVirksomheter && selvstendigVirksomheter.length > 0)
    );
};
