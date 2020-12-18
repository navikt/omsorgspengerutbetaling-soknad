import * as React from 'react';
import { useIntl } from 'react-intl';
import StepFooter from '@navikt/sif-common-core/lib/components/step-footer/StepFooter';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import Step, { StepProps } from '../components/step/Step';
import { getStepConfig } from '../config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToNAVno, navigateToWelcomePage } from '../utils/navigationUtils';
import { getStepTexts } from '../utils/stepUtils';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadTempStorage from './SøknadTempStorage';

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

const SøknadStep: React.FunctionComponent<Props> = (props: Props) => {
    const formik = useFormikContext<SøknadFormData>();
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id, cleanupStep } = props;
    const stepConfig = getStepConfig(formik.values);
    const texts = getStepTexts(intl, id, stepConfig);

    const handleAvsluttOgFortsettSenere = () => {
        navigateToNAVno();
    };

    const handleAvbrytOgSlettSøknad = () => {
        SøknadTempStorage.purge().then(() => {
            navigateToWelcomePage();
        });
    };

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
                            disabled={buttonDisabled || false}>
                            {texts.nextButtonLabel}
                        </Knapp>
                    </FormBlock>
                )}
            </SøknadFormComponents.Form>
            {isFeatureEnabled(Feature.MELLOMLAGRING) && (
                <StepFooter
                    onAvbrytOgFortsettSenere={handleAvsluttOgFortsettSenere}
                    onAvbrytOgSlett={handleAvbrytOgSlettSøknad}
                />
            )}
        </Step>
    );
};

export default SøknadStep;
