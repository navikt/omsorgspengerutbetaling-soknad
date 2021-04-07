import * as React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { initialValues, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendeFormPart';

const shouldShowSubmitButton = (søknadFormData: SøknadFormData): boolean => {
    const erFrilanser: YesOrNo = søknadFormData[SøknadFormField.frilans_erFrilanser];
    const erSelvstendigNæringsdrivende: YesOrNo | undefined =
        søknadFormData[SøknadFormField.selvstendig_erSelvstendigNæringsdrivende];

    return !(erFrilanser === YesOrNo.NO && erSelvstendigNæringsdrivende === YesOrNo.NO);
};

const cleanupStep = (values: SøknadFormData): SøknadFormData => {
    const { frilans_erFrilanser, selvstendig_erSelvstendigNæringsdrivende } = values;
    const cleanedValues = { ...values };

    // Cleanup frilanser
    if (frilans_erFrilanser === YesOrNo.NO) {
        cleanedValues.frilans_jobberFortsattSomFrilans = initialValues.frilans_jobberFortsattSomFrilans;
        cleanedValues.frilans_startdato = initialValues.frilans_startdato;
        cleanedValues.frilans_sluttdato = initialValues.frilans_sluttdato;
    } else {
        if (values.frilans_jobberFortsattSomFrilans === YesOrNo.YES) {
            cleanedValues.frilans_sluttdato = initialValues.frilans_sluttdato;
        }
    }
    // Cleanup selvstendig næringsdrivende
    if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.NO) {
        cleanedValues.selvstendig_virksomheter = undefined;
    }
    return cleanedValues;
};

const ArbeidssituasjonStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const showSubmitButton = shouldShowSubmitButton(values);

    return (
        <SøknadStep
            id={StepID.ARBEIDSSITUASJON}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={showSubmitButton}
            cleanupStep={cleanupStep}>
            <CounsellorPanel>
                <p>
                    <FormattedHtmlMessage id="step.arbeidssituasjon.info.1" />
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
                        <FormattedHtmlMessage id="step.arbeidssituasjon.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default ArbeidssituasjonStep;
