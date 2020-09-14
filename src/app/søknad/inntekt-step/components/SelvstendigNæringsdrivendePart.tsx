import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import { useFormikContext } from 'formik';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { StepID } from '../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import SøknadTempStorage from '../../SøknadTempStorage';

interface Props {
    formValues: SøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    return (
        <>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.selvstendig_harHattInntektSomSN}
                legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                validate={validateYesOrNoIsAnswered}
            />
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <FormBlock margin="l">
                    <ResponsivePanel>
                        <VirksomhetListAndDialog
                            name={SøknadFormField.selvstendig_virksomheter}
                            hideFormFields={{ harRevisor: true }}
                            labels={{
                                listTitle: intlHelper(intl, 'selvstendig.list.tittel'),
                                addLabel: intlHelper(intl, 'selvstendig.list.leggTilLabel'),
                                modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel'),
                            }}
                            validate={validateRequiredList}
                            onAfterChange={
                                isFeatureEnabled(Feature.MELLOMLAGRING)
                                    ? () => {
                                          SøknadTempStorage.persist(values, StepID.INNTEKT);
                                      }
                                    : undefined
                            }
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
