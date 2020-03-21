import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoIsAnswered';

const Q = SøknadFormField;

const HarUtbetaltFørsteTiDagerConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.har_utbetalt_ti_dager]: {
        isAnswered: ({ har_utbetalt_ti_dager }) => yesOrNoIsAnswered(har_utbetalt_ti_dager)
    },
    [Q.innvilget_utvidet_rett]: {
        parentQuestion: Q.har_utbetalt_ti_dager,
        isIncluded: ({ har_utbetalt_ti_dager }) => har_utbetalt_ti_dager === YesOrNo.NO,
        isAnswered: ({ innvilget_utvidet_rett }) => yesOrNoIsAnswered(innvilget_utvidet_rett)
    },
    [Q.ingen_andre_barn_under_tolv]: {
        parentQuestion: Q.innvilget_utvidet_rett,
        visibilityFilter: ({ innvilget_utvidet_rett }) => innvilget_utvidet_rett === YesOrNo.YES,
        isAnswered: ({ ingen_andre_barn_under_tolv }) => yesOrNoIsAnswered(ingen_andre_barn_under_tolv)
    },
    [Q.fisker_på_blad_B]: {
        visibilityFilter: ({ har_utbetalt_ti_dager }) => har_utbetalt_ti_dager === YesOrNo.NO,
        isAnswered: ({ fisker_på_blad_B }) => yesOrNoIsAnswered(fisker_på_blad_B)
    },
    [Q.frivillig_forsikring]: {
        visibilityFilter: ({ har_utbetalt_ti_dager }) => har_utbetalt_ti_dager === YesOrNo.NO,
        isAnswered: ({ frivillig_forsikring }) => yesOrNoIsAnswered(frivillig_forsikring)
    },
    [Q.nettop_startet_selvstendig_frilanser]: {
        visibilityFilter: ({ har_utbetalt_ti_dager }) => har_utbetalt_ti_dager === YesOrNo.NO,
        isAnswered: ({ nettop_startet_selvstendig_frilanser }) =>
            yesOrNoIsAnswered(nettop_startet_selvstendig_frilanser)
    }
};

export const HarUtbetaltFørsteTiDagerConfiguestions = Questions<SøknadFormData, SøknadFormField>(
    HarUtbetaltFørsteTiDagerConfig
);
