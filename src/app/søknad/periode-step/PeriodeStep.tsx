import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../validation/constants';
import { validateFørsteDagMedFravær, validateSisteDagMedFravær } from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const førsteDag: Date | undefined = datepickerUtils.getDateFromDateString(values.førsteDagMedFravær);

    return (
        <SøknadStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedMessage id="step.periode.veileder" />
            </CounsellorPanel>

            <FormBlock margin="xxl">
                <SøknadFormComponents.DatePicker
                    label={intlHelper(intl, 'step.periode.førsteDagMedFravær.spm')}
                    name={SøknadFormField.førsteDagMedFravær}
                    minDate={GYLDIG_TIDSROM.from}
                    maxDate={GYLDIG_TIDSROM.to}
                    validate={validateFørsteDagMedFravær}
                />
            </FormBlock>
            <FormBlock margin="xxl">
                <SøknadFormComponents.DatePicker
                    label={intlHelper(intl, 'step.periode.sisteDagMedFravær.spm')}
                    name={SøknadFormField.sisteDagMedFravær}
                    minDate={førsteDag || GYLDIG_TIDSROM.from}
                    maxDate={dateToday}
                    validate={(value) => validateSisteDagMedFravær(value, values.førsteDagMedFravær)}
                />
            </FormBlock>
        </SøknadStep>
    );
};

export default PeriodeStep;
