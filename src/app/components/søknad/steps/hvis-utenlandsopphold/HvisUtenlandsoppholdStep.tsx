import * as React from 'react';
import { useIntl } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';

const HvisUtenlandsoppholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.HVIS_UTENLANDSOPPHOLD} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: Hvis utenlandsopphold så skal dette steppet legges til.</CounsellorPanel>

            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion
                    name={SøknadFormField.hvis_utenlandsopphold_en_test_verdi}
                    legend={intlHelper(intl, 'step.hvis_utenlandsopphold.en_test_verdi.spm')}
                />
            </FormBlock>
        </FormikStep>
    );
};

export default HvisUtenlandsoppholdStep;
