import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../../../utils/yesOrNoIsAnswered';

const Q = SøknadFormField;

const HarUtbetaltFørsteTiDagerConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.har_utbetalt_ti_dager]: {
        isAnswered: ({ har_utbetalt_ti_dager }) => yesOrNoIsAnswered(har_utbetalt_ti_dager)
    },
    [Q.innvilget_rett_og_ingen_andre_barn_under_tolv]: {
        parentQuestion: Q.har_utbetalt_ti_dager,
        isIncluded: ({ har_utbetalt_ti_dager }) => har_utbetalt_ti_dager === YesOrNo.NO,
        isAnswered: ({ innvilget_rett_og_ingen_andre_barn_under_tolv }) =>
            yesOrNoIsAnswered(innvilget_rett_og_ingen_andre_barn_under_tolv)
    },
    [Q.fisker_på_blad_B]: {
        parentQuestion: Q.innvilget_rett_og_ingen_andre_barn_under_tolv,
        isAnswered: ({ fisker_på_blad_B }) => yesOrNoIsAnswered(fisker_på_blad_B)
    },
    [Q.frivillig_forsikring]: {
        parentQuestion: Q.fisker_på_blad_B,
        isAnswered: ({ frivillig_forsikring }) => yesOrNoIsAnswered(frivillig_forsikring)
    },
    [Q.nettop_startet_selvstendig_frilanser]: {
        parentQuestion: Q.frivillig_forsikring,
        isAnswered: ({ nettop_startet_selvstendig_frilanser }) =>
            yesOrNoIsAnswered(nettop_startet_selvstendig_frilanser)
    }
};

export const HarUtbetaltFørsteTiDagerConfiguestions = Questions<SøknadFormData, SøknadFormField>(
    HarUtbetaltFørsteTiDagerConfig
);
