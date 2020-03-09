import React from 'react';
import { useIntl } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import { dateToday } from 'common/utils/dateUtils';
import { validateRequiredField } from 'common/validation/fieldValidations';
import FrilansEksempeltHtml from './FrilansEksempelHtml';
import FormikYesOrNoQuestion from "common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion";
import {AppFormField, OmsorgspengesøknadFormData} from "../../../types/OmsorgspengesøknadFormData";
import intlHelper from "common/utils/intlUtils";
import FormikDatepicker from "common/formik/components/formik-datepicker/FormikDatepicker";

interface Props {
    formValues: OmsorgspengesøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const harHattInntektSomFrilanser = formValues[AppFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const intl = useIntl();
    return (
        <>
            <FormikYesOrNoQuestion<AppFormField>
                name={AppFormField.frilans_harHattInntektSomFrilanser}
                legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                info={<FrilansEksempeltHtml />}
            />
            {harHattInntektSomFrilanser && (
                <Panel>
                    <Box>
                        <FormikDatepicker<AppFormField>
                            name={AppFormField.frilans_startdato}
                            label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                            showYearSelector={true}
                            dateLimitations={{ maksDato: dateToday }}
                            validate={validateRequiredField}
                        />
                    </Box>
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            name={AppFormField.frilans_jobberFortsattSomFrilans}
                            legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                        />
                    </Box>
                </Panel>
            )}
        </>
    );
};

export default FrilansFormPart;
