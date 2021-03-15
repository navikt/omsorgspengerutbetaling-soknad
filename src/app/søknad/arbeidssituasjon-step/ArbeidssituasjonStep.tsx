import * as React from 'react';
import { useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { initialValues, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendePart';

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

const ArbeidssituasjonStep: React.FunctionComponent<
    StepConfigProps & { førsteDagMedFravær: Date; sisteDagMedFravær: Date }
> = ({ førsteDagMedFravær, sisteDagMedFravær, onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const intl = useIntl();
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
                <FrilansFormPart
                    førsteDagMedFravær={førsteDagMedFravær}
                    sisteDagMedFravær={sisteDagMedFravær}
                    formValues={values}
                />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart
                    førsteDagMedFravær={førsteDagMedFravær}
                    sisteDagMedFravær={sisteDagMedFravær}
                    formValues={values}
                />
            </Box>
            {!showSubmitButton && (
                <FormBlock margin="l">
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.arbeidssituasjon.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {showSubmitButton && (
                <Box margin="l" padBottom="l">
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.er_arbeidstaker}
                        legend={intlHelper(intl, 'step.arbeidssituasjon.er_arbeidstaker')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </Box>
            )}
        </SøknadStep>
    );
};

export default ArbeidssituasjonStep;
