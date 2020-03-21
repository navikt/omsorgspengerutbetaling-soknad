import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Panel from 'nav-frontend-paneler';
import { PopoverOrientering } from 'nav-frontend-popover';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import { dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    validateRequiredField, validateYesOrNoIsAnswered
} from 'common/validation/fieldValidations';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import SøknadFormComponents from '../../SøknadFormComponents';
import FrilansEksempeltHtml from './FrilansEksempelHtml';

interface Props {
    formValues: SøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const harHattInntektSomFrilanser = formValues[SøknadFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const intl = useIntl();
    return (
        <>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.frilans_harHattInntektSomFrilanser}
                legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                info={<FrilansEksempeltHtml />}
                infoPlassering={PopoverOrientering.Under}
                validate={validateYesOrNoIsAnswered}
            />
            {harHattInntektSomFrilanser && (
                <FormBlock margin="l">
                    <Panel>
                        <Box>
                            <SøknadFormComponents.DatePicker
                                name={SøknadFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                dateLimitations={{ maksDato: dateToday }}
                                validate={validateRequiredField}
                            />
                        </Box>
                        <Box margin="xl">
                            <SøknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                    </Panel>
                </FormBlock>
            )}
        </>
    );
};

export default FrilansFormPart;
