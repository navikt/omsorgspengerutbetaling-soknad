import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../../../utils/yesOrNoIsAnswered';

const Q = SøknadFormField;

const NårKanManFåStepConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.tre_eller_fler_barn]: {
        isAnswered: ({ tre_eller_fler_barn }) => yesOrNoIsAnswered(tre_eller_fler_barn)
    },
    [Q.alene_om_omsorg_for_barn]: {
        parentQuestion: Q.tre_eller_fler_barn,
        isAnswered: ({ alene_om_omsorg_for_barn }) => yesOrNoIsAnswered(alene_om_omsorg_for_barn)
    },
    [Q.rett_til_mer_enn_ti_dager_totalt]: {
        parentQuestion: Q.alene_om_omsorg_for_barn,
        isAnswered: ({ rett_til_mer_enn_ti_dager_totalt }) => yesOrNoIsAnswered(rett_til_mer_enn_ti_dager_totalt)
    },
    [Q.den_andre_forelderen_ikke_kan_ta_seg_av_barnet]: {
        parentQuestion: Q.rett_til_mer_enn_ti_dager_totalt,
        isAnswered: ({ den_andre_forelderen_ikke_kan_ta_seg_av_barnet }) =>
            yesOrNoIsAnswered(den_andre_forelderen_ikke_kan_ta_seg_av_barnet)
    },
    [Q.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming]: {
        parentQuestion: Q.den_andre_forelderen_ikke_kan_ta_seg_av_barnet,
        isAnswered: ({ har_barn_som_har_kronisk_sykdom_eller_funksjonshemming }) =>
            yesOrNoIsAnswered(har_barn_som_har_kronisk_sykdom_eller_funksjonshemming)
    }
};

export const NårKanManFåStepQuestions = Questions<SøknadFormData, SøknadFormField>(NårKanManFåStepConfig);
