import * as React from 'react';
import { useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { EgenutbetalingQuestions } from './config';

const EgenutbetalingStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const visibility = EgenutbetalingQuestions.getVisbility(values);

    const showSubmitButton = visibility.areAllQuestionsAnswered();

    const cleanupEgenbetaling = (v: SøknadFormData): SøknadFormData => {
        if (v.har_utbetalt_ti_dager === YesOrNo.YES) {
            return {
                ...v,
                fisker_på_blad_B: YesOrNo.UNANSWERED,
                frivillig_forsikring: YesOrNo.UNANSWERED,
                nettop_startet_selvstendig_frilanser: YesOrNo.UNANSWERED,
                innvilget_utvidet_rett: YesOrNo.UNANSWERED,
                ingen_andre_barn_under_tolv: YesOrNo.UNANSWERED
            };
        }
        return v;
    };

    return (
        <SøknadStep
            id={StepID.EGENUTBETALING}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={showSubmitButton}
            cleanupStep={cleanupEgenbetaling}>
            <CounsellorPanel>{intlHelper(intl, 'step.egenutbetaling.counsellorpanel.content')}</CounsellorPanel>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.har_utbetalt_ti_dager}
                    legend={intlHelper(intl, 'step.egenutbetaling.ja_nei_spm.legend')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {visibility.isVisible(SøknadFormField.fisker_på_blad_B) && (
                <>
                    <FormBlock>
                        <AlertStripeInfo>
                            Som hovedregel må selvstendig næringsdrivende og frilansere dekke de 3 første omsorgsdagene
                            selv. I noen tilfeller kan du få utbetaling fra 1. dag. Hvis du skal få utbetalt fra 1. dag
                            må minst én av de neste punktene gjelde for deg.
                        </AlertStripeInfo>
                    </FormBlock>
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.fisker_på_blad_B}
                            legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.fisker_på_blad_B.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                </>
            )}
            {visibility.isVisible(SøknadFormField.frivillig_forsikring) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.frivillig_forsikring}
                        legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.frivillig_forsikring.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.nettop_startet_selvstendig_frilanser) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.nettop_startet_selvstendig_frilanser}
                        legend={intlHelper(
                            intl,
                            'step.har_utbetalt_de_første_ti_dagene.nettop_startet_selvstendig_frilanser.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.innvilget_utvidet_rett) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.innvilget_utvidet_rett}
                        legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.innvilget_utvidet_rett.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.ingen_andre_barn_under_tolv) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.ingen_andre_barn_under_tolv}
                        legend={intlHelper(
                            intl,
                            'step.har_utbetalt_de_første_ti_dagene.ingen_andre_barn_under_tolv.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default EgenutbetalingStep;
