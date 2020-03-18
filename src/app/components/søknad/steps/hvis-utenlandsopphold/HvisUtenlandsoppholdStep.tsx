import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';

const HvisUtenlandsoppholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.HVIS_UTENLANDSOPPHOLD} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: Hvis utenlandsopphold så skal dette steppet legges til.</CounsellorPanel>

            <FormBlock margin={'xxl'}>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.hvis_utenlandsopphold_en_test_verdi}
                    legend={intlHelper(intl, 'step.hvis_utenlandsopphold.en_test_verdi.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
        </FormikStep>
    );
};

export default HvisUtenlandsoppholdStep;
