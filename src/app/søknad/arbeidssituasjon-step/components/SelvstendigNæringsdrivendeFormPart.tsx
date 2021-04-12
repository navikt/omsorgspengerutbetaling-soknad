import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import { StepID } from '../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getEnvironmentVariable } from '../../../utils/envUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import SøknadTempStorage from '../../SøknadTempStorage';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';

interface Props {
    formValues: SøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues: values }) => {
    const intl = useIntl();
    const skipOrgNumValidation = getEnvironmentVariable('SKIP_ORGNUM_VALIDATION') === 'true';
    const erSelvstendigNæringsdrivende = values.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
    const harFlereVirksomheter =
        erSelvstendigNæringsdrivende && values.selvstendig_harFlereVirksomheter === YesOrNo.YES;
    return (
        <>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.selvstendig_erSelvstendigNæringsdrivende}
                legend={intlHelper(intl, 'selvstendig.erDuSelvstendigNæringsdrivende.spm')}
                validate={validateYesOrNoIsAnswered}
            />

            {erSelvstendigNæringsdrivende && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.selvstendig_harFlereVirksomheter}
                        legend={intlHelper(intl, 'selvstendig.harFlereVirksomheter.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}

            {harFlereVirksomheter && (
                <FormBlock>
                    <CounsellorPanel>
                        <FormattedMessage id="selvstendig.veileder.flereAktiveVirksomheter" />
                    </CounsellorPanel>
                </FormBlock>
            )}

            {erSelvstendigNæringsdrivende && values.selvstendig_harFlereVirksomheter !== YesOrNo.UNANSWERED && (
                <FormBlock>
                    <ResponsivePanel>
                        <VirksomhetListAndDialog
                            name={SøknadFormField.selvstendig_virksomheter}
                            maxItems={1}
                            gjelderFlereVirksomheter={harFlereVirksomheter}
                            labels={{
                                listTitle: intlHelper(intl, 'selvstendig.virksomhetSummary.tittel'),
                                addLabel: intlHelper(intl, 'selvstendig.virksomhetSummary.registrerKnapp'),
                                modalTitle: harFlereVirksomheter
                                    ? intlHelper(intl, 'selvstendig.dialog.tittel.flere')
                                    : intlHelper(intl, 'selvstendig.dialog.tittel.en'),
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
