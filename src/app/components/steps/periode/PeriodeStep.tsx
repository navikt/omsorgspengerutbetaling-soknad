import * as React from 'react';
import {StepConfigProps, StepID} from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';

const PeriodeStep = ({ onValidSubmit }: StepConfigProps) => {
    // const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                TODO: PERIODE
            </CounsellorPanel>

        </FormikStep>
    );
};

export default PeriodeStep;
