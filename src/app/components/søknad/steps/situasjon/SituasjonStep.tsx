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
import { SituasjonStepQuestions } from './config';

const HvaErDinSituasjon = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const visibility = SituasjonStepQuestions.getVisbility(values);
    return (
        <FormikStep
            id={StepID.SITUASJON}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            <CounsellorPanel>{intlHelper(intl, 'step.hva-er-din-situasjon.counsellorpanel.content')}</CounsellorPanel>

            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.tre_eller_fler_barn}
                    legend={intlHelper(intl, 'step.hva-er-din-situasjon.tre_eller_fler_barn.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {visibility.isVisible(SøknadFormField.alene_om_omsorg_for_barn) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.alene_om_omsorg_for_barn}
                        legend={intlHelper(intl, 'step.hva-er-din-situasjon.alene_om_omsorg_for_barn.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.rett_til_mer_enn_ti_dager_totalt) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.rett_til_mer_enn_ti_dager_totalt}
                        legend={intlHelper(intl, 'step.hva-er-din-situasjon.rett_til_mer_enn_ti_dager_totalt.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet}
                        legend={intlHelper(
                            intl,
                            'step.hva-er-din-situasjon.den_andre_forelderen_ikke_kan_ta_seg_av_barnet.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming) && (
                <FormBlock>
                    <TypedFormComponents.YesOrNoQuestion
                        name={SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming}
                        legend={intlHelper(
                            intl,
                            'step.hva-er-din-situasjon.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default HvaErDinSituasjon;
