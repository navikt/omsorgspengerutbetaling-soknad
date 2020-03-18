import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';

const NårKanManFåUtbetaltOmsorgspengerStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                {intlHelper(intl, 'step.når-kan-man-få-utbetalt-omsorgspenger.counsellorpanel.content')}
            </CounsellorPanel>

            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.tre_eller_fler_barn}
                    legend={intlHelper(intl, 'step.når-kan-man-få-utbetalt-omsorgspenger.tre_eller_fler_barn.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.alene_om_omsorg_for_barn}
                    legend={intlHelper(intl, 'step.når-kan-man-få-utbetalt-omsorgspenger.alene_om_omsorg_for_barn.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.rett_til_mer_enn_ti_dager_totalt}
                    legend={intlHelper(
                        intl,
                        'step.når-kan-man-få-utbetalt-omsorgspenger.rett_til_mer_enn_ti_dager_totalt.spm'
                    )}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet}
                    legend={intlHelper(
                        intl,
                        'step.når-kan-man-få-utbetalt-omsorgspenger.den_andre_forelderen_ikke_kan_ta_seg_av_barnet.spm'
                    )}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming}
                    legend={intlHelper(
                        intl,
                        'step.når-kan-man-få-utbetalt-omsorgspenger.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming.spm'
                    )}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
        </FormikStep>
    );
};

export default NårKanManFåUtbetaltOmsorgspengerStep;
