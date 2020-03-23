import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoIsAnswered';

const Q = SøknadFormField;

const SituasjonStepConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.har_fosterbarn]: {
        isAnswered: ({ har_fosterbarn }) => yesOrNoIsAnswered(har_fosterbarn)
    },
    [Q.fosterbarn]: {
        parentQuestion: Q.har_fosterbarn,
        isIncluded: ({ har_fosterbarn }) => har_fosterbarn === YesOrNo.YES,
        isAnswered: ({ fosterbarn }) => fosterbarn !== undefined && fosterbarn.length > 0
    }
};

export const SituasjonStepQuestions = Questions<SøknadFormData, SøknadFormField>(SituasjonStepConfig);
