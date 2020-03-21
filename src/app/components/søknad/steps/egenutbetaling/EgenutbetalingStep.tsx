import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';
import { HarUtbetaltFørsteTiDagerConfiguestions } from './config';

const EgenutbetalingStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const visibility = HarUtbetaltFørsteTiDagerConfiguestions.getVisbility(values);
    return (
        <FormikStep
            id={StepID.EGENUTBETALING}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            <CounsellorPanel>
                {intlHelper(intl, 'step.har-utbetalt-de-første-ti-dagene.counsellorpanel.content')}
            </CounsellorPanel>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.har_utbetalt_ti_dager}
                    legend={intlHelper(intl, 'step.har-utbetalt-de-første-ti-dagene.ja_nei_spm.legend')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {visibility.isVisible(SøknadFormField.innvilget_rett_og_ingen_andre_barn_under_tolv) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.innvilget_rett_og_ingen_andre_barn_under_tolv}
                        legend={intlHelper(
                            intl,
                            'step.har_utbetalt_de_første_ti_dagene.innvilget_rett_og_ingen_andre_barn_under_tolv.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}{' '}
            {visibility.isVisible(SøknadFormField.fisker_på_blad_B) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.fisker_på_blad_B}
                        legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.fisker_på_blad_B.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.frivillig_forsikring) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.frivillig_forsikring}
                        legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.frivillig_forsikring.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}{' '}
            {visibility.isVisible(SøknadFormField.nettop_startet_selvstendig_frilanser) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.nettop_startet_selvstendig_frilanser}
                        legend={intlHelper(
                            intl,
                            'step.har_utbetalt_de_første_ti_dagene.nettop_startet_selvstendig_frilanser.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default EgenutbetalingStep;
