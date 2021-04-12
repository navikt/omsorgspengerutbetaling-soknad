import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredField,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import { StepID } from '../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getEnvironmentVariable } from '../../../utils/envUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import SøknadTempStorage from '../../SøknadTempStorage';

interface Props {
    formValues: SøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues: values }) => {
    const intl = useIntl();
    const skipOrgNumValidation = getEnvironmentVariable('SKIP_ORGNUM_VALIDATION') === 'true';
    const {
        selvstendig_erSelvstendigNæringsdrivende,
        selvstendig_virksomhet,
        selvstendig_harFlereVirksomheter,
    } = values;
    const erSelvstendigNæringsdrivende = selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
    const harFlereVirksomheter = erSelvstendigNæringsdrivende && selvstendig_harFlereVirksomheter === YesOrNo.YES;
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
                        <VirksomhetInfoAndDialog
                            name={SøknadFormField.selvstendig_virksomhet}
                            harFlereVirksomheter={harFlereVirksomheter}
                            labels={{
                                infoTitle: selvstendig_virksomhet
                                    ? intlHelper(intl, 'selvstendig.infoDialog.infoTittel')
                                    : undefined,
                                editLabel: intlHelper(intl, 'selvstendig.infoDialog.endreKnapp'),
                                deleteLabel: intlHelper(intl, 'selvstendig.infoDialog.fjernKnapp'),
                                addLabel: intlHelper(intl, 'selvstendig.infoDialog.registrerKnapp'),
                                modalTitle: harFlereVirksomheter
                                    ? intlHelper(intl, 'selvstendig.infoDialog.tittel.flere')
                                    : intlHelper(intl, 'selvstendig.infoDialog.tittel.en'),
                            }}
                            skipOrgNumValidation={skipOrgNumValidation}
                            validate={validateRequiredField}
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
