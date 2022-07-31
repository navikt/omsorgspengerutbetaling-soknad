import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getEnvironmentVariable } from '../../../utils/envUtils';
import SoknadFormComponents from '../../SoknadFormComponents';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { StepID } from '../../../søknad/soknadStepsConfig';
import SøknadTempStorage from '../../../søknad/SoknadTempStorage';
import { Barn, Person } from '../../../types/Søkerdata';

interface Props {
    formValues: SøknadFormData;
    barn: Barn[];
    søker: Person;
    soknadId?: string;
}

const SelvstendigNæringsdrivendeFormPart: React.FC<Props> = ({ formValues: values, barn, søker, soknadId }) => {
    const intl = useIntl();
    const skipOrgNumValidation = getEnvironmentVariable('SKIP_ORGNUM_VALIDATION') === 'true';
    const { selvstendig_erSelvstendigNæringsdrivende, selvstendig_virksomhet, selvstendig_harFlereVirksomheter } =
        values;
    const erSelvstendigNæringsdrivende = selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
    const harFlereVirksomheter = erSelvstendigNæringsdrivende && selvstendig_harFlereVirksomheter === YesOrNo.YES;
    const [virksomhetChanged, setVirksomhetChanged] = useState(false);

    useEffect(() => {
        if (virksomhetChanged === true && soknadId !== undefined) {
            setVirksomhetChanged(false);
            SøknadTempStorage.update(soknadId, values, StepID.ARBEIDSSITUASJON, { søker: søker, barn: barn });
        }
    }, [virksomhetChanged, values, soknadId, søker, barn]);

    return (
        <>
            <SoknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.selvstendig_erSelvstendigNæringsdrivende}
                legend={intlHelper(intl, 'selvstendig.erDuSelvstendigNæringsdrivende.spm')}
                validate={getYesOrNoValidator()}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'step.arbeidssituasjon.selvstendig.hjelpetekst.tittel')}>
                        <>
                            {intlHelper(intl, 'step.arbeidssituasjon.selvstendig.hjelpetekst')}{' '}
                            <Lenke href={getLenker(intl.locale).skatteetatenSN} target="_blank">
                                <FormattedMessage id="step.arbeidssituasjon.selvstendig.hjelpetekst.snSkatteetatenLenke" />
                            </Lenke>
                        </>
                    </ExpandableInfo>
                }
            />

            {erSelvstendigNæringsdrivende && (
                <FormBlock>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.selvstendig_harFlereVirksomheter}
                        legend={intlHelper(intl, 'selvstendig.harFlereVirksomheter.spm')}
                        validate={getYesOrNoValidator()}
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
                            validate={getRequiredFieldValidator()}
                            onAfterChange={() => setVirksomhetChanged(true)}
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
