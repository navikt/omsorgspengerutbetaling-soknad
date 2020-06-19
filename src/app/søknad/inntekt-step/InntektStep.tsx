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
import { useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';

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
                    Før du kan bruke av omsorgsdagene og ha rett til omsorgspenger, må du ha vært i jobb i minst 4 uker.
                </p>

                <p>
                    Når vi spør om de 4 siste ukene, mener vi de 4 siste ukene før den første dagen du søker utbetaling
                    for.
                </p>

                <p>
                    Hvis du ikke har jobbet de 4 siste ukene, men mottatt en utbetaling fra NAV som er likestilt med
                    jobb, skal du svare ja. Disse utbetalingene er: omsorgspenger, sykepenger, dagpenger,
                    foreldrepenger, svangerskapspenger, pleiepenger eller opplæringspenger.
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
                    <AlertStripeAdvarsel>Du må velge minst én av situasjonene over. </AlertStripeAdvarsel>
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
