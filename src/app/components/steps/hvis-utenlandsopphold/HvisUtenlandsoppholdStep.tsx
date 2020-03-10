import * as React from 'react';
import {StepConfigProps, StepID} from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from "common/components/form-block/FormBlock";
import FormikYesOrNoQuestion from "common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion";
import {AppFormField} from "../../../types/OmsorgspengesøknadFormData";
import intlHelper from "common/utils/intlUtils";
import {useIntl} from "react-intl";

const HvisUtenlandsoppholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.HVIS_UTENLANDSOPPHOLD} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                TODO: Hvis utenlandsopphold så skal dette steppet legges til.
            </CounsellorPanel>

            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion
                    name={AppFormField.hvis_utenlandsopphold_en_test_verdi}
                    legend={intlHelper(intl, 'step.hvis_utenlandsopphold.en_test_verdi.spm')}
                />
            </FormBlock>

        </FormikStep>
    );
};

export default HvisUtenlandsoppholdStep;
