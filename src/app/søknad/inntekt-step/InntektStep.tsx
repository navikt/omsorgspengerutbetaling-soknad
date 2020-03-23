import * as React from 'react';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendePart';

const InntektStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();

    return (
        <SøknadStep id={StepID.INNTEKT} onValidFormSubmit={onValidSubmit}>
            <Box margin="l" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>
        </SøknadStep>
    );
};

export default InntektStep;
