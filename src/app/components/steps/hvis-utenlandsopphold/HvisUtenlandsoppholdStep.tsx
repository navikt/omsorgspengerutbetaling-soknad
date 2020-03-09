import * as React from 'react';
import {StepConfigProps, StepID} from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';

const HvisUtenlandsoppholdStep = ({ onValidSubmit }: StepConfigProps) => {

    return (
        <FormikStep id={StepID.HVIS_UTENLANDSOPPHOLD} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                TODO: Hvis utenlandsopphold så skal dette steppet legges til.
            </CounsellorPanel>

        </FormikStep>
    );
};

export default HvisUtenlandsoppholdStep;
