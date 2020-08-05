import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { sendApplication } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import { FosterbarnApi, SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FrilansSummary from './components/FrilansSummary';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import SelvstendigSummary from './components/SelvstendigSummary';
import { SpørsmålOgSvarSummaryView } from './components/SporsmalOgSvarSummaryView';
import SummaryBlock from './components/SummaryBlock';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import JaNeiSvar from './components/JaNeiSvar';
import { validateSoknadApiData } from '../../validation/soknadApiDataValidation';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import appSentryLogger from '../../utils/appSentryLogger';

interface Props {
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

const renderApiDataFeil = (feil: FeiloppsummeringFeil) => <span>{feil.feilmelding}</span>;

const OppsummeringStep: React.StatelessComponent<Props> = ({ onApplicationSent }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const søkerdata = React.useContext(SøkerdataContext);
    const history = useHistory();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    async function navigate(data: SøknadApiData, søker: Søkerdata) {
        setSendingInProgress(true);
        try {
            await sendApplication(data);
            onApplicationSent(apiValues, søker);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                appSentryLogger.logApiError(error);
                navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    }

    if (!søkerdata) {
        return null;
    }

    const {
        person: { fornavn, mellomnavn, etternavn, fødselsnummer }
    } = søkerdata;

    const apiValues: SøknadApiData = mapFormDataToApiData(values, intl);
    const fosterbarn = apiValues.fosterbarn || [];

    const apiValidationErrors = validateSoknadApiData(apiValues);

    return (
        <SøknadStep
            id={StepID.OPPSUMMERING}
            onValidFormSubmit={() => {
                setTimeout(() => {
                    navigate(apiValues, søkerdata); // La view oppdatere seg først
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
                    <NavnOgFodselsnummerSummaryView
                        intl={intl}
                        fornavn={fornavn}
                        etternavn={etternavn}
                        mellomnavn={mellomnavn}
                        fødselsnummer={fødselsnummer}
                    />
                    <UtbetalingsperioderSummaryView utbetalingsperioder={apiValues.utbetalingsperioder} />
                    {apiValues.andreUtbetalinger.length > 0 && (
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.søkt_om_andre_utbetalinger')}>
                            <SummaryList
                                items={apiValues.andreUtbetalinger}
                                itemRenderer={(utbetaling) => (
                                    <span>{intlHelper(intl, `andre_utbetalinger.${utbetaling}`)}</span>
                                )}
                            />
                        </SummaryBlock>
                    )}

                    <Box margin={'s'}>
                        <SummaryBlock header={intlHelper(intl, 'steg.intro.form.spm.smittevernhensyn')}>
                            <JaNeiSvar harSvartJa={apiValues.hjemmePgaSmittevernhensyn} />
                        </SummaryBlock>
                    </Box>

                    <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />

                    <SpørsmålOgSvarSummaryView yesNoSpørsmålOgSvar={apiValues.spørsmål} />

                    {fosterbarn.length > 0 && (
                        <SummaryBlock header="Fosterbarn">
                            <SummaryList
                                items={fosterbarn}
                                itemRenderer={(barn: FosterbarnApi) => <>{barn.fødselsnummer}</>}
                            />
                        </SummaryBlock>
                    )}
                    <FrilansSummary frilans={apiValues.frilans} />
                    <SelvstendigSummary selvstendigVirksomheter={apiValues.selvstendigVirksomheter} />
                    <MedlemskapSummaryView bosteder={apiValues.bosteder} />

                    {apiValues.vedlegg.length === 0 && apiValues.hjemmePgaSmittevernhensyn && (
                        <Box margin={'s'}>
                            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                                <FormattedMessage id={'steg.oppsummering.dokumenter.ikkelastetopp'} />
                            </SummaryBlock>
                        </Box>
                    )}
                    {apiValues.vedlegg.length > 0 && (
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                            <UploadedDocumentsList includeDeletionFunctionality={false} />
                        </SummaryBlock>
                    )}
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
