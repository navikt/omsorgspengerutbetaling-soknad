import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import Step, { StepProps } from '../components/step/Step';
import StepFooter from '../components/stepFooter/StepFooter';
import { getStepConfig } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { getStepTexts } from '../utils/stepUtils';
import SøknadFormComponents from './SøknadFormComponents';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
    cleanupStep?: (values: SøknadFormData) => SøknadFormData;
}

type Props = FormikStepProps & StepProps;

const SøknadStep: React.FunctionComponent<Props> = (props) => {
    const formik = useFormikContext<SøknadFormData>();
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id, cleanupStep } = props;
    const stepConfig = getStepConfig(formik.values);
    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <SøknadFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                cleanup={cleanupStep}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                {props.showSubmitButton !== false && (
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
                )}
            </SøknadFormComponents.Form>
            <StepFooter />
        </Step>
    );
};

export default SøknadStep;
