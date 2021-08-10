import * as React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { cleanupArbeidssituasjonStep } from './cleanupArbeidssituasjonStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendeFormPart';

const shouldShowSubmitButton = (søknadFormData: SøknadFormData): boolean => {
    const erFrilanser: YesOrNo = søknadFormData[SøknadFormField.frilans_erFrilanser];
    const erSelvstendigNæringsdrivende: YesOrNo | undefined =
        søknadFormData[SøknadFormField.selvstendig_erSelvstendigNæringsdrivende];

    return !(erFrilanser === YesOrNo.NO && erSelvstendigNæringsdrivende === YesOrNo.NO);
};

const ArbeidssituasjonStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const showSubmitButton = shouldShowSubmitButton(values);

    return (
        <SøknadStep
            id={StepID.ARBEIDSSITUASJON}
            onValidFormSubmit={onValidSubmit}
            cleanupStep={cleanupArbeidssituasjonStep}>
            <CounsellorPanel>
                <p>
                    <FormattedHtmlMessage id="step.arbeidssituasjon.info.1" />
                </p>
            </CounsellorPanel>

            <Box margin="xxl" padBottom="l">
                <FrilansFormPart formValues={values} showSubmitButton={showSubmitButton} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} showSubmitButton={showSubmitButton} />
            </Box>
            {!showSubmitButton && (
                <FormBlock margin="l">
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.arbeidssituasjon.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default ArbeidssituasjonStep;
