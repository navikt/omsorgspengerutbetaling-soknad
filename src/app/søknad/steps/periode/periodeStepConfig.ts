import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoIsAnswered';

const Q = SøknadFormField;

const PeriodeStepConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.harPerioderMedFravær]: {
        isAnswered: ({ harPerioderMedFravær }) => yesOrNoIsAnswered(harPerioderMedFravær)
    },
    [Q.perioderMedFravær]: {
        parentQuestion: Q.harPerioderMedFravær,
        isIncluded: ({ harPerioderMedFravær }) => harPerioderMedFravær === YesOrNo.NO,
        isAnswered: ({ perioderMedFravær }) => perioderMedFravær.length > 0
    }
};

export const PeriodeStepQuestions = Questions<SøknadFormData, SøknadFormField>(PeriodeStepConfig);
