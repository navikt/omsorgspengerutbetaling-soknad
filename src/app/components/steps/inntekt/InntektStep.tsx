import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import { OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import Box from 'common/components/box/Box';
import { useFormikContext } from 'formik';
import FrilansFormPart from './FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';

const InntektStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();

    return (
        <FormikStep id={StepID.INNTEKT} onValidFormSubmit={onValidSubmit}>
            <Box margin="l" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>
        </FormikStep>
    );
};

export default InntektStep;
