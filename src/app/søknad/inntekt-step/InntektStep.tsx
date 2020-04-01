import * as React from 'react';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SøknadFormComponents from '../SøknadFormComponents';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendePart';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape, useIntl } from 'react-intl';

const shouldShowSubmitButton = (søknadFormData: SøknadFormData) => {
    const harHattInntektSomFrilanser: YesOrNo = søknadFormData[SøknadFormField.frilans_harHattInntektSomFrilanser];
    const harHattInntektSomSN: YesOrNo | undefined = søknadFormData[SøknadFormField.selvstendig_harHattInntektSomSN];

    return !(harHattInntektSomFrilanser === YesOrNo.NO && harHattInntektSomSN === YesOrNo.NO);
};

export const getInntektArbeidstakerTekst = (intl: IntlShape, erFrilanser: YesOrNo, erSelvstendig: YesOrNo): string => {
    if (erFrilanser === YesOrNo.YES && erSelvstendig === YesOrNo.YES) {
        return intlHelper(intl, 'step.inntekt.er_arbeidstaker.begge');
    }
    if (erFrilanser === YesOrNo.YES) {
        return intlHelper(intl, 'step.inntekt.er_arbeidstaker.frilanser');
    }
    return intlHelper(intl, 'step.inntekt.er_arbeidstaker.selvstendig');
};

const InntektStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const intl = useIntl();

    const showSubmitButton = shouldShowSubmitButton(values);

    const getArbeidstakerQuestionText = (): string => {
        return getInntektArbeidstakerTekst(
            intl,
            values.frilans_harHattInntektSomFrilanser,
            values.selvstendig_harHattInntektSomSN
        );
    };

    return (
        <SøknadStep id={StepID.INNTEKT} onValidFormSubmit={onValidSubmit} showSubmitButton={showSubmitButton}>
            <Box margin="l" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>
            {!showSubmitButton && (
                <FormBlock margin="l">
                    <AlertStripeAdvarsel>Du må velge minst én av situasjonene over. </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {showSubmitButton && (
                <Box margin="l" padBottom="l">
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.er_arbeidstaker}
                        legend={getArbeidstakerQuestionText()}
                        validate={validateYesOrNoIsAnswered}
                    />
                </Box>
            )}
        </SøknadStep>
    );
};

export default InntektStep;
