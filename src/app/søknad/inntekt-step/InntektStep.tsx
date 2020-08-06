import * as React from 'react';
import { useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendePart';

const shouldShowSubmitButton = (søknadFormData: SøknadFormData) => {
    const harHattInntektSomFrilanser: YesOrNo = søknadFormData[SøknadFormField.frilans_harHattInntektSomFrilanser];
    const harHattInntektSomSN: YesOrNo | undefined = søknadFormData[SøknadFormField.selvstendig_harHattInntektSomSN];

    return !(harHattInntektSomFrilanser === YesOrNo.NO && harHattInntektSomSN === YesOrNo.NO);
};

const InntektStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const intl = useIntl();

    const showSubmitButton = shouldShowSubmitButton(values);

    return (
        <SøknadStep id={StepID.INNTEKT} onValidFormSubmit={onValidSubmit} showSubmitButton={showSubmitButton}>
            <CounsellorPanel>
                <p>
                    <FormattedHtmlMessage id="step.inntekt.info.1" />
                </p>
                <p>
                    <FormattedHtmlMessage id="step.inntekt.info.2" />
                </p>
                <p>
                    <FormattedHtmlMessage id="step.inntekt.info.3" />
                </p>
            </CounsellorPanel>

            <Box margin="xxl" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>
            {!showSubmitButton && (
                <FormBlock margin="l">
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.inntekt.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {showSubmitButton && (
                <Box margin="l" padBottom="l">
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.er_arbeidstaker}
                        legend={intlHelper(intl, 'step.inntekt.er_arbeidstaker')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </Box>
            )}
        </SøknadStep>
    );
};

export default InntektStep;
