import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { sendApplication } from '../../api/api';
import { SKJEMANAVN } from '../../App';
import SummarySection from '../../components/summary-section/SummarySection';
import UploadedSmittevernDocumentsList from '../../components/uploaded-smittevern-documents-list/UploadedSmittevernDocumentsList';
import UploadedStengtDocumentsList from '../../components/uploaded-stengt-documents-list/UploadedStengtDocumentsList';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import { ApiBarn, SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import { validateSoknadApiData } from '../../validation/apiDataValidation';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FrilansSummary from './components/FrilansSummary';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import SelvstendigSummary from './components/SelvstendigSummary';
import SummaryBlock from './components/SummaryBlock';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import JaNeiSvar from './components/JaNeiSvar';

interface Props {
    hjemmePgaSmittevernhensyn: boolean;
    hjemmePgaStengtBhgSkole: boolean;
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

const renderApiDataFeil = (feil: FeiloppsummeringFeil) => <span>{feil.feilmelding}</span>;

const barnListItemRenderer = (barn: ApiBarn): JSX.Element => {
    return (
        <>
            {barn.navn}
            {barn.identitetsnummer ? ` (${barn.identitetsnummer})` : undefined}
        </>
    );
};

const OppsummeringStep: React.FunctionComponent<Props> = ({
    hjemmePgaStengtBhgSkole,
    hjemmePgaSmittevernhensyn,
    onApplicationSent,
}) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const søkerdata = React.useContext(SøkerdataContext);
    const history = useHistory();

    const [sendingInProgress, setSendingInProgress] = useState(false);
    const { logSoknadFailed, logSoknadSent, logUserLoggedOut } = useAmplitudeInstance();

    async function doSendSoknad(data: SøknadApiData, søker: Søkerdata) {
        setSendingInProgress(true);
        try {
            await sendApplication(data);
            await logSoknadSent(SKJEMANAVN);
            onApplicationSent(apiValues, søker);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                await logUserLoggedOut('Innsending av søknad');
                navigateToLoginPage();
            } else {
                logSoknadFailed(SKJEMANAVN);
                appSentryLogger.logApiError(error);
                navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    }

    if (!søkerdata) {
        return null;
    }

    const {
        person: { fornavn, mellomnavn, etternavn, fødselsnummer },
        registrerteBarn,
    } = søkerdata;

    const apiValues: SøknadApiData = mapFormDataToApiData(values, registrerteBarn, intl);
    const { barn = [] } = apiValues;
    const harAleneomsorgFor = barn.filter((b) => b.aleneOmOmsorgen);

    const apiValidationErrors = validateSoknadApiData(apiValues);

    return (
        <SøknadStep
            id={StepID.OPPSUMMERING}
            onValidFormSubmit={() => {
                setTimeout(() => {
                    doSendSoknad(apiValues, søkerdata); // La view oppdatere seg først
                });
            }}
            useValidationErrorSummary={false}
            buttonDisabled={sendingInProgress || apiValidationErrors.length > 0}
            showButtonSpinner={sendingInProgress}>
            <CounsellorPanel>
                <FormattedMessage id="steg.oppsummering.info" />
            </CounsellorPanel>
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

                    {/* Om barn */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.barn.header')}>
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.barn.alleBarn')}>
                            <SummaryList items={barn} itemRenderer={barnListItemRenderer} />
                        </SummaryBlock>
                        {harAleneomsorgFor.length > 0 && (
                            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.barn.harAleneomsorgFor')}>
                                <SummaryList items={harAleneomsorgFor} itemRenderer={barnListItemRenderer} />
                            </SummaryBlock>
                        )}
                    </SummarySection>

                    {/* Omsorgsdager du søker utbetaling for */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.utbetalinger.header')}>
                        <SummaryBlock header={intlHelper(intl, 'step.fravaer.spm.harDekketTiFørsteDagerSelv')}>
                            <JaNeiSvar harSvartJa={apiValues._harDekketTiFørsteDagerSelv} />
                        </SummaryBlock>
                        <UtbetalingsperioderSummaryView utbetalingsperioder={apiValues.utbetalingsperioder} />
                        <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />
                    </SummarySection>

                    {/* Frilansinntekt */}
                    <FrilansSummary frilans={apiValues.frilans} />

                    {/* Næringsinntekt */}
                    <SelvstendigSummary selvstendigVirksomheter={apiValues.selvstendigVirksomheter} />

                    {/* Eventuelle andre inntekter */}
                    <SummarySection header={intlHelper(intl, 'summary.andreIntekter.header')}>
                        <SummaryBlock header={intlHelper(intl, 'step.fravaer.harSøktAndreUtbetalinger.spm')}>
                            <JaNeiSvar harSvartJa={apiValues._harSøktAndreUtbetalinger} />
                        </SummaryBlock>
                        {apiValues.andreUtbetalinger.length > 0 && (
                            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.harSøktOmAndreUtbetalinger')}>
                                <SummaryList
                                    items={apiValues.andreUtbetalinger}
                                    itemRenderer={(utbetaling) => (
                                        <span>{intlHelper(intl, `andreUtbetalinger.${utbetaling}`)}</span>
                                    )}
                                />
                            </SummaryBlock>
                        )}
                    </SummarySection>

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
                                    {apiValues._vedleggSmittevern.length === 0 && (
                                        <FormattedMessage id={'steg.oppsummering.dokumenter.ikkelastetopp'} />
                                    )}
                                    {apiValues._vedleggSmittevern.length > 0 && (
                                        <UploadedSmittevernDocumentsList includeDeletionFunctionality={false} />
                                    )}
                                </SummaryBlock>
                            </Box>
                        )}
                        {hjemmePgaStengtBhgSkole && (
                            <Box margin="s">
                                <SummaryBlock
                                    header={intlHelper(intl, 'steg.oppsummering.dokumenterStengtBhgSkole.header')}>
                                    {apiValues._vedleggStengtSkole.length === 0 && (
                                        <FormattedMessage id={'steg.oppsummering.dokumenter.ikkelastetopp'} />
                                    )}
                                    {apiValues._vedleggStengtSkole.length > 0 && (
                                        <UploadedStengtDocumentsList includeDeletionFunctionality={false} />
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
                    <SøknadFormComponents.ConfirmationCheckbox
                        label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                        name={SøknadFormField.harBekreftetOpplysninger}
                        validate={(value) => {
                            let result;
                            if (value !== true) {
                                result = intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet');
                            }
                            return result;
                        }}
                    />
                </Box>
            )}
        </SøknadStep>
    );
};

export default OppsummeringStep;
