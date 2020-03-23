import * as React from 'react';
import {useFormikContext} from 'formik';
import Box from 'common/components/box/Box';
import {StepConfigProps, StepID} from '../../config/stepConfig';
import {SøknadFormData, SøknadFormField} from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendePart';
import {YesOrNo} from "common/types/YesOrNo";
import FormBlock from "common/components/form-block/FormBlock";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";

const shouldShowSubmitButton = (søknadFormData: SøknadFormData) => {
    const harHattInntektSomFrilanser: YesOrNo = søknadFormData[SøknadFormField.frilans_harHattInntektSomFrilanser];
    const harHattInntektSomSN: YesOrNo | undefined = søknadFormData[SøknadFormField.selvstendig_harHattInntektSomSN];

    return !(harHattInntektSomFrilanser === YesOrNo.NO && harHattInntektSomSN === YesOrNo.NO)
};

const InntektStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();

    const showSubmitButton = shouldShowSubmitButton(values);
    return (
        <SøknadStep
            id={StepID.INNTEKT} onValidFormSubmit={onValidSubmit}
            showSubmitButton={showSubmitButton}
        >
            <Box margin="l" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>

            {!showSubmitButton && (
                <FormBlock margin="xxl">
                    <AlertStripeAdvarsel>Du må velge én av situasjonene over. </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default InntektStep;
