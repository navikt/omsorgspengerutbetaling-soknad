import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { Person } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormField } from '../../types/SøknadFormData';
import { validateSoknadApiData } from '../../validation/apiDataValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import FrilansSummary from './components/FrilansSummary';
import JaNeiSvar from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/JaNeiSvar';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import SelvstendigSummary from './components/SelvstendigSummary';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import DineBarnSummaryList from './components/DineBarnSummaryList';
import SoknadFormStep from '../SoknadFormStep';
import { isPending } from '@devexperts/remote-data-ts';
import { StepID } from '../soknadStepsConfig';
import { useSoknadContext } from '../SoknadContext';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

interface Props {
    hjemmePgaSmittevernhensyn: boolean;
    dokumenterSmittevernhensyn: Attachment[];
    hjemmePgaStengtBhgSkole: boolean;
    dokumenterStengtBkgSkole: Attachment[];
    søker: Person;
    apiValues?: SøknadApiData;
}

const renderApiDataFeil = (feil: FeiloppsummeringFeil) => <span>{feil.feilmelding}</span>;

const OppsummeringStep: React.FC<Props> = ({
    hjemmePgaSmittevernhensyn,
    dokumenterSmittevernhensyn,
    hjemmePgaStengtBhgSkole,
    dokumenterStengtBkgSkole,
    søker,
    apiValues,
}) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();
    const { fornavn, mellomnavn, etternavn, fødselsnummer } = søker;

    const apiValidationErrors = apiValues ? validateSoknadApiData(apiValues) : [];

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
            <CounsellorPanel>
                <FormattedMessage id="steg.oppsummering.info" />
            </CounsellorPanel>
            {apiValues === undefined && <div>Api verdier mangler</div>}
            {apiValues !== undefined && (
                <>
                    <Box margin="xl">
                        <ResponsivePanel border={true}>
                            {/* Om deg */}
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.omDeg')}>
                                <NavnOgFodselsnummerSummaryView
                                    fornavn={fornavn}
                                    etternavn={etternavn}
                                    mellomnavn={mellomnavn}
                                    fødselsnummer={fødselsnummer}
                                />
                            </SummarySection>

                            {/* Dine Barn */}
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.dineBarn')}>
                                <DineBarnSummaryList barn={apiValues.barn} />
                                {apiValues.harDekketTiFørsteDagerSelv && (
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            'steg.oppsummering.dineBarn.bekrefterDektTiDagerSelv'
                                        )}>
                                        <JaNeiSvar harSvartJa={apiValues.harDekketTiFørsteDagerSelv} />
                                    </SummaryBlock>
                                )}
                            </SummarySection>

                            {/* Omsorgsdager du søker utbetaling for */}
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.utbetalinger.header')}>
                                <UtbetalingsperioderSummaryView utbetalingsperioder={apiValues.utbetalingsperioder} />
                                <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />
                            </SummarySection>

                            {/* Frilansinntekt */}
                            <FrilansSummary frilans={apiValues.frilans} />

                            {/* Næringsinntekt */}
                            <SelvstendigSummary virksomhet={apiValues.selvstendigNæringsdrivende} />

                            {/* Medlemskap i folketrygden */}
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.medlemskap.header')}>
                                <MedlemskapSummaryView bosteder={apiValues.bosteder} />
                            </SummarySection>

                            {/* Vedlegg */}
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                                {hjemmePgaSmittevernhensyn && (
                                    <Box margin="s">
                                        <SummaryBlock
                                            header={intlHelper(intl, 'steg.oppsummering.dokumenterSmittevern.header')}>
                                            {dokumenterSmittevernhensyn.length === 0 && (
                                                <FormattedMessage id={'steg.oppsummering.dokumenter.ikkelastetopp'} />
                                            )}
                                            {dokumenterSmittevernhensyn.length > 0 && (
                                                <AttachmentList attachments={dokumenterSmittevernhensyn} />
                                            )}
                                        </SummaryBlock>
                                    </Box>
                                )}
                                {hjemmePgaStengtBhgSkole && (
                                    <Box margin="s">
                                        <SummaryBlock
                                            header={intlHelper(
                                                intl,
                                                'steg.oppsummering.dokumenterStengtBhgSkole.header'
                                            )}>
                                            {dokumenterStengtBkgSkole.length === 0 && (
                                                <FormattedMessage id={'steg.oppsummering.dokumenter.ikkelastetopp'} />
                                            )}
                                            {dokumenterStengtBkgSkole.length > 0 && (
                                                <AttachmentList attachments={dokumenterStengtBkgSkole} />
                                            )}
                                        </SummaryBlock>
                                    </Box>
                                )}
                                {!hjemmePgaSmittevernhensyn && !hjemmePgaStengtBhgSkole && (
                                    <Box margin="s">
                                        <FormattedMessage id={'steg.oppsummering.dokumenter.ingenVedlegg'} />
                                    </Box>
                                )}
                            </SummarySection>
                        </ResponsivePanel>
                    </Box>
                </>
            )}
            {apiValidationErrors.length > 0 && (
                <FormBlock>
                    <Feiloppsummering
                        customFeilRender={(feil) => renderApiDataFeil(feil)}
                        tittel={intlHelper(intl, 'steg.oppsummering.apiValideringFeil.tittel')}
                        feil={apiValidationErrors}
                    />
                </FormBlock>
            )}

            {apiValidationErrors.length === 0 && (
                <Box margin="l">
                    <SoknadFormComponents.ConfirmationCheckbox
                        label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                        name={SøknadFormField.harBekreftetOpplysninger}
                        validate={getCheckedValidator()}
                    />
                </Box>
            )}
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
