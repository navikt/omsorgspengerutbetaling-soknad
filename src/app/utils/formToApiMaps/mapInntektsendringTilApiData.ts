import { YesOrNo } from 'common/types/YesOrNo';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import {
    Arbeidstype,
    Endring,
    InntektsendringGruppe,
    InntektsendringSkjemaFields
} from '../../components/inntektsendring/types';
import { EndringApiData, EndringArbeidssituasjon } from '../../types/SøknadApiData';
import { harPerioderMedHopp } from '../../components/inntektsendring/periodeUtils';
import { FraværDelerAvDag, Periode } from '../../../@types/omsorgspengerutbetaling-schema';
import { formatDateToApiFormat } from 'common/utils/dateUtils';

export const endringerTilendringerApiData = (endring: Endring): EndringApiData => {
    return {
        dato: formatDateToApiFormat(endring.dato),
        forklaring: endring.forklaring
    };
};

export const settInnEndringArbeidssituasjon = (
    perioder: Periode[],
    fraværDelerAvDagListe: FraværDelerAvDag[],
    frilansHarHattInntektSomFrilanser: YesOrNo,
    selvstendigVirksomheter: Virksomhet[] | undefined,
    inntektsendring: InntektsendringGruppe
): EndringArbeidssituasjon | null => {
    if (harPerioderMedHopp(perioder, fraværDelerAvDagListe)) {
        const harEndringFrilans: boolean =
            frilansHarHattInntektSomFrilanser === YesOrNo.YES &&
            inntektsendring[Arbeidstype.frilans][InntektsendringSkjemaFields.harHattEndring] === YesOrNo.YES;
        const harEndringSelvstendig: boolean =
            selvstendigVirksomheter !== undefined &&
            selvstendigVirksomheter.length > 0 &&
            inntektsendring[Arbeidstype.selvstendig][InntektsendringSkjemaFields.harHattEndring] === YesOrNo.YES;
        return {
            harEndringFrilans,
            endringerFrilans: harEndringFrilans
                ? inntektsendring[Arbeidstype.frilans][InntektsendringSkjemaFields.endringer].map(
                      endringerTilendringerApiData
                  )
                : [],
            harEndringSelvstendig,
            endringerSelvstendig: harEndringSelvstendig
                ? inntektsendring[Arbeidstype.selvstendig][InntektsendringSkjemaFields.endringer].map(
                      endringerTilendringerApiData
                  )
                : []
        };
    } else {
        return null;
    }
};
