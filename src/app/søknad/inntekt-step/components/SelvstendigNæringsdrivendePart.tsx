import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import { Panel } from 'nav-frontend-paneler';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import {
    validateRequiredList, validateYesOrNoIsAnswered
} from 'common/validation/fieldValidations';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import SøknadFormComponents from '../../SøknadFormComponents';

interface Props {
    formValues: SøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const intl = useIntl();
    return (
        <>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.selvstendig_harHattInntektSomSN}
                legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                validate={validateYesOrNoIsAnswered}
            />
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <FormBlock margin="l">
                    <Panel>
                        <VirksomhetListAndDialog
                            name={SøknadFormField.selvstendig_virksomheter}
                            labels={{
                                listTitle: intlHelper(intl, 'selvstendig.list.tittel'),
                                addLabel: intlHelper(intl, 'selvstendig.list.leggTilLabel'),
                                modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel')
                            }}
                            validate={validateRequiredList}
                        />
                    </Panel>
                </FormBlock>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
