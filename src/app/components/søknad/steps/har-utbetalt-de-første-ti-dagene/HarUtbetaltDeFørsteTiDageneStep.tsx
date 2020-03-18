import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';

const HarUtbetaltDeFørsteTiDageneStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const { har_utbetalt_ti_dager } = values;

    return (
        <FormikStep id={StepID.HAR_UTBETALT_DE_FØRST_TI_DAGENE} onValidFormSubmit={onValidSubmit}>
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

            {har_utbetalt_ti_dager === YesOrNo.NO && (
                <>
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
                    <FormBlock>
                        <TypedFormComponents.YesOrNoQuestion
                            name={SøknadFormField.fisker_på_blad_B}
                            legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.fisker_på_blad_B.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    <FormBlock>
                        <TypedFormComponents.YesOrNoQuestion
                            name={SøknadFormField.frivillig_forsikring}
                            legend={intlHelper(intl, 'step.har_utbetalt_de_første_ti_dagene.frivillig_forsikring.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
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
                </>
            )}
        </FormikStep>
    );
};

export default HarUtbetaltDeFørsteTiDageneStep;
