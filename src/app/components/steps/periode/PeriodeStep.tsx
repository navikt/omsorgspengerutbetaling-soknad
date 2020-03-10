import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import PeriodeForm from './PeriodeForm';

const PeriodeStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: PERIODE</CounsellorPanel>

            <PeriodeForm />

            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion
                    name={AppFormField.periode_har_vært_i_utlandet}
                    legend={intlHelper(intl, 'step.periode.har_dy_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                />
            </FormBlock>
        </FormikStep>
    );
};

export default PeriodeStep;
