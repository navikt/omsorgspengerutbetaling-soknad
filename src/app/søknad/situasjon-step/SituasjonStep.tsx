import * as React from 'react';
import {
    validateRequiredList, validateYesOrNoIsAnswered
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { SituasjonStepQuestions } from './config';
import FosterbarnListAndDialog from './fosterbarn-list-and-dialog/FosterbarnListAndDialog';

const HvaErDinSituasjon = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const visibility = SituasjonStepQuestions.getVisbility(values);

    const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
        const { har_fosterbarn } = values;
        const cleanedValues = { ...valuesToBeCleaned };
        if (har_fosterbarn === YesOrNo.NO) {
            cleanedValues.fosterbarn = [];
        }
        return cleanedValues;
    };

    return (
        <SøknadStep
            id={StepID.SITUASJON}
            onValidFormSubmit={onValidSubmit}
            cleanupStep={cleanupStep}
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            <CounsellorPanel>
                Vi henter som regel opplysninger om dine barn fra Folkeregisteret, men vi har fortsatt behov for å
                spørre deg om fosterbarn.
            </CounsellorPanel>

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.har_fosterbarn}
                    legend="Har du fosterbarn?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {visibility.isVisible(SøknadFormField.fosterbarn) && (
                <FormBlock>
                    <FosterbarnListAndDialog
                        labels={{
                            addLabel: 'Legg til fosterbarn',
                            listTitle: 'Fosterbarn du har lagt til',
                            modalTitle: 'Fosterbarn'
                        }}
                        name={SøknadFormField.fosterbarn}
                        validate={validateRequiredList}
                    />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default HvaErDinSituasjon;
