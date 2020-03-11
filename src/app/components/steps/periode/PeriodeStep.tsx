import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { FormattedMessage, useIntl } from 'react-intl';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import { validatePerioder } from '../../../validation/fieldValidations';
import PeriodeListAndDialog from './PeriodeListAndDialog';
import Box from 'common/components/box/Box';
import LabelWithInfo from 'common/formik/components/helpers/label-with-info/LabelWithInfo';

const PeriodeStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: PERIODE</CounsellorPanel>

            <FormBlock margin={'xxl'}>
                <Box padBottom="l">
                    <LabelWithInfo info={<FormattedMessage id="step.periode.dager_med_fullt_fravært.info" />}>
                        <FormattedMessage id="step.periode.dager_med_fullt_fravært.label" />
                    </LabelWithInfo>
                </Box>

                <PeriodeListAndDialog<AppFormField>
                    name={AppFormField.perioderMedFravær}
                    minDate={date1YearAgo}
                    maxDate={dateToday}
                    validate={validatePerioder}
                    labels={{
                        addLabel: 'Legg til ny periode',
                        modalTitle: 'Periode'
                    }}
                />
            </FormBlock>

            <FormBlock margin={'xxl'}>
                <Box padBottom="l">
                    <LabelWithInfo info={<FormattedMessage id="step.periode.dager_med_delvis_fravært.info" />}>
                        <FormattedMessage id="step.periode.dager_med_delvis_fravært.label" />
                    </LabelWithInfo>
                </Box>

            </FormBlock>

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
