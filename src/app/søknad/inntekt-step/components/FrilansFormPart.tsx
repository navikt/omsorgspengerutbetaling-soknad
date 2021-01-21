import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredField,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
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
                description={
                    <ExpandableInfo title="Hva er en frilanser?">
                        <FrilansEksempeltHtml />
                    </ExpandableInfo>
                }
                validate={validateYesOrNoIsAnswered}
            />
            {harHattInntektSomFrilanser && (
                <FormBlock margin="l">
                    <ResponsivePanel className={'responsivePanel'}>
                        <Box>
                            <SøknadFormComponents.DatePicker
                                name={SøknadFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
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
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default FrilansFormPart;
