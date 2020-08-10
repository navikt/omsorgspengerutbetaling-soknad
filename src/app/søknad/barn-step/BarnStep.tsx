import * as React from 'react';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import FosterbarnListAndDialog from '@navikt/sif-common-forms/lib/fosterbarn/FosterbarnListAndDialog';
import { useFormikContext } from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { BarnStepQuestions } from './config';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

const BarnStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const visibility = BarnStepQuestions.getVisbility(values);

    const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
        const { har_fosterbarn } = values;
        const cleanedValues = { ...valuesToBeCleaned };
        if (har_fosterbarn === YesOrNo.NO) {
            cleanedValues.fosterbarn = [];
        }
        return cleanedValues;
    };

    return (
        <SøknadStep id={StepID.BARN} onValidFormSubmit={onValidSubmit} cleanupStep={cleanupStep}>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.har_fosterbarn}
                    legend={intlHelper(intl, 'steg.barn.fosterbarn.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {visibility.isVisible(SøknadFormField.fosterbarn) && (
                <FormBlock margin="l">
                    <FosterbarnListAndDialog name={SøknadFormField.fosterbarn} validate={validateRequiredList} />
                </FormBlock>
            )}
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.har_fått_ekstra_omsorgsdager}
                    legend={intlHelper(intl, 'steg.barn.har_fått_ekstra_omsorgsdager.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
        </SøknadStep>
    );
};

export default BarnStep;
