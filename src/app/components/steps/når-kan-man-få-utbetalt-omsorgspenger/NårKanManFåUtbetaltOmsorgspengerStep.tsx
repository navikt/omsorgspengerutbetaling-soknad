import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { useIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';

const NårKanManFåUtbetaltOmsorgspengerStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();

    return (
        <FormikStep id={StepID.NÅR_KAN_MAN_FÅ_UTBETALT_OMSORGSPENGER} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                {intlHelper(intl, 'step.når-kan-man-få-utbetalt-omsorgspenger.counsellorpanel.content')}
            </CounsellorPanel>

            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.tre_eller_fler_barn}
                    legend={intlHelper(intl, 'step.når-kan-man-få-utbetalt-omsorgspenger.tre_eller_fler_barn.spm')}
                />
            </FormBlock>
            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.alene_om_omsorg_for_barn}
                    legend={intlHelper(intl, 'step.når-kan-man-få-utbetalt-omsorgspenger.alene_om_omsorg_for_barn.spm')}
                />
            </FormBlock>
            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.rett_til_mer_enn_ti_dager_totalt}
                    legend={intlHelper(
                        intl,
                        'step.når-kan-man-få-utbetalt-omsorgspenger.rett_til_mer_enn_ti_dager_totalt.spm'
                    )}
                />
            </FormBlock>
            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.den_andre_forelderen_ikke_kan_ta_seg_av_barnet}
                    legend={intlHelper(
                        intl,
                        'step.når-kan-man-få-utbetalt-omsorgspenger.den_andre_forelderen_ikke_kan_ta_seg_av_barnet.spm'
                    )}
                />
            </FormBlock>
            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming}
                    legend={intlHelper(
                        intl,
                        'step.når-kan-man-få-utbetalt-omsorgspenger.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming.spm'
                    )}
                />
            </FormBlock>
        </FormikStep>
    );
};

export default NårKanManFåUtbetaltOmsorgspengerStep;
