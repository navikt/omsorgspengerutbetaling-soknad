import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import { getStepConfig } from '../../../config/stepConfig';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { getStepTexts } from '../../../utils/stepUtils';
import Step, { StepProps } from '../../step/Step';
import TypedFormComponents from '../typed-form-components/TypedFormComponents';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
}

type Props = FormikStepProps & StepProps;

const FormikStep: React.FunctionComponent<Props> = (props) => {
    const formik = useFormikContext<SøknadFormData>();
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id } = props;
    const stepConfig = getStepConfig(formik.values);
    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <TypedFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                <FormBlock>
                    <Knapp
                        type="hoved"
                        htmlType="submit"
                        className={'step__button'}
                        spinner={showButtonSpinner || false}
                        disabled={buttonDisabled || false}
                        aria-label={texts.nextButtonAriaLabel}>
                        {texts.nextButtonLabel}
                    </Knapp>
                </FormBlock>
            </TypedFormComponents.Form>
        </Step>
    );
};

export default FormikStep;
