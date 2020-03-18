import React from 'react';
import { useIntl } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import { dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    validateRequiredField, validateYesOrNoIsAnswered
} from 'common/validation/fieldValidations';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';
import FrilansEksempeltHtml from './FrilansEksempelHtml';

interface Props {
    formValues: SøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const harHattInntektSomFrilanser = formValues[SøknadFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const intl = useIntl();
    return (
        <>
            <TypedFormComponents.YesOrNoQuestion
                name={SøknadFormField.frilans_harHattInntektSomFrilanser}
                legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                info={<FrilansEksempeltHtml />}
                validate={validateYesOrNoIsAnswered}
            />
            {harHattInntektSomFrilanser && (
                <Panel>
                    <Box>
                        <TypedFormComponents.DatePicker
                            name={SøknadFormField.frilans_startdato}
                            label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                            showYearSelector={true}
                            dateLimitations={{ maksDato: dateToday }}
                            validate={validateRequiredField}
                        />
                    </Box>
                    <Box margin="xl">
                        <TypedFormComponents.YesOrNoQuestion
                            name={SøknadFormField.frilans_jobberFortsattSomFrilans}
                            legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </Box>
                </Panel>
            )}
        </>
    );
};

export default FrilansFormPart;
