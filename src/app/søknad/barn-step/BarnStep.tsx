import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import FosterbarnListAndDialog from '@navikt/sif-common-forms/lib/fosterbarn/FosterbarnListAndDialog';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';

const BarnStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
        const { harFosterbarn } = values;
        const cleanedValues = { ...valuesToBeCleaned };
        if (harFosterbarn === YesOrNo.NO) {
            cleanedValues.fosterbarn = [];
        }
        return cleanedValues;
    };

    return (
        <SøknadStep id={StepID.BARN} onValidFormSubmit={onValidSubmit} cleanupStep={cleanupStep}>
            <FormBlock>
                <CounsellorPanel>
                    <FormattedMessage id="steg.barn.intro" />
                </CounsellorPanel>
            </FormBlock>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harFosterbarn}
                    legend={intlHelper(intl, 'steg.barn.fosterbarn.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {values.harFosterbarn === YesOrNo.YES && (
                <FormBlock margin="l">
                    <FosterbarnListAndDialog name={SøknadFormField.fosterbarn} validate={validateRequiredList} />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default BarnStep;
