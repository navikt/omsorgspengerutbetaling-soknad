import * as React from 'react';
import {useFormikContext} from 'formik';
import {AlertStripeAdvarsel} from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import FormBlock from 'common/components/form-block/FormBlock';
import {YesOrNo} from 'common/types/YesOrNo';
import {StepConfigProps, StepID} from '../../config/stepConfig';
import {SøknadFormData, SøknadFormField} from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import FrilansFormPart from './components/FrilansFormPart';
import SøknadFormComponents from '../SøknadFormComponents';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendePart';
import {validateYesOrNoIsAnswered} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {useIntl} from 'react-intl';
import InntektsendringSkjemaView from '../../components/inntektsendring/components/InntektsendringSkjemaView';
import {Arbeidstype} from '../../components/inntektsendring/types';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';

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
            <Box padBottom={'l'}>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        Når vi spør om de 4 siste ukene mener vi de 4 siste ukene før <strong>den første</strong> dagen
                        du søker om utbetaling av omsorgspenger.
                    </Box>
                    <Box padBottom={'l'}>
                        Hvis du søker om en periode som er i direkte sammenheng med en periode du har søkt om tidligere,
                        menes det de 4 siste ukene før den første dagen i <strong>hele perioden</strong>
                    </Box>
                    <Box padBottom={'l'}>
                        Hvis du ikke har vært i jobb de 4 siste ukene, men har hatt omsorgspenger, sykepenger,
                        dagpenger, foreldrepenger, svangerskapspenger, pleiepenger eller opplæringspenger, er dette
                        likestilt med jobb.
                    </Box>
                </CounsellorPanel>
            </Box>

            <Box margin="l" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            { values[SøknadFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES && values.inntektsendring !== undefined && (
                <InntektsendringSkjemaView
                    formikInntektsgruppeRootName={SøknadFormField.inntektsendring}
                    inntektsendringGruppe={values.inntektsendring}
                    arbeidstype={Arbeidstype.frilans}
                    perioderMedFravær={values[SøknadFormField.perioderMedFravær]}
                    dagerMedDelvisFravær={values[SøknadFormField.dagerMedDelvisFravær]}
                />
            )}

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>

            {  values.selvstendig_virksomheter && values.inntektsendring !== undefined && values.selvstendig_virksomheter.length > 0 && (
                <InntektsendringSkjemaView
                    formikInntektsgruppeRootName={SøknadFormField.inntektsendring}
                    inntektsendringGruppe={values.inntektsendring}
                    arbeidstype={Arbeidstype.selvstendig}
                    perioderMedFravær={values[SøknadFormField.perioderMedFravær]}
                    dagerMedDelvisFravær={values[SøknadFormField.dagerMedDelvisFravær]}
                />
            )}

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
