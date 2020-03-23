import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { SituasjonStepQuestions } from './config';

const HvaErDinSituasjon = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const visibility = SituasjonStepQuestions.getVisbility(values);
    return (
        <SøknadStep
            id={StepID.SITUASJON}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            <CounsellorPanel>{intlHelper(intl, 'step.situasjon.counsellorpanel.content')}</CounsellorPanel>

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.tre_eller_fler_barn}
                    legend={intlHelper(intl, 'step.situasjon.tre_eller_fler_barn.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {visibility.isVisible(SøknadFormField.alene_om_omsorg_for_barn) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.alene_om_omsorg_for_barn}
                        legend={intlHelper(intl, 'step.situasjon.alene_om_omsorg_for_barn.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.rett_til_mer_enn_ti_dager_totalt) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.rett_til_mer_enn_ti_dager_totalt}
                        legend={intlHelper(intl, 'step.situasjon.rett_til_mer_enn_ti_dager_totalt.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet}
                        legend={intlHelper(intl, 'step.situasjon.den_andre_forelderen_ikke_kan_ta_seg_av_barnet.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {visibility.isVisible(SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming}
                        legend={intlHelper(
                            intl,
                            'step.situasjon.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default HvaErDinSituasjon;
