import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import { useFormikContext } from 'formik';
import { StepID } from '../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getEnvironmentVariable } from '../../../utils/envUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import SøknadTempStorage from '../../SøknadTempStorage';

interface Props {
    førsteDagMedFravær: Date;
    sisteDagMedFravær: Date;
    formValues: SøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const skipOrgNumValidation = getEnvironmentVariable('SKIP_ORGNUM_VALIDATION') === 'true';
    return (
        <>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.selvstendig_erSelvstendigNæringsdrivende}
                legend={intlHelper(intl, 'selvstendig.erDuSelvstendigNæringsdrivende.spm')}
                validate={validateYesOrNoIsAnswered}
            />
            {formValues.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES && (
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
                            skipOrgNumValidation={skipOrgNumValidation}
                            validate={validateRequiredList}
                            onAfterChange={() => {
                                SøknadTempStorage.update(values, StepID.ARBEIDSSITUASJON);
                            }}
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
