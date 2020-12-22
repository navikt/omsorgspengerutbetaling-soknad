import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { sendApplication } from '../../api/api';
import SummarySection from '../../components/summary-section/SummarySection';
import UploadedSmittevernDocumentsList from '../../components/uploaded-smittevern-documents-list/UploadedSmittevernDocumentsList';
import UploadedStengtDocumentsList from '../../components/uploaded-stengt-documents-list/UploadedStengtDocumentsList';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import { FosterbarnApi, SøknadApiData, YesNoSpørsmålOgSvar } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import { validateSoknadApiData } from '../../validation/soknadApiDataValidation';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FrilansSummary from './components/FrilansSummary';
import JaNeiSvar from './components/JaNeiSvar';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import SelvstendigSummary from './components/SelvstendigSummary';
import { SpørsmålOgSvarSummaryView } from './components/SporsmalOgSvarSummaryView';
import SummaryBlock from './components/SummaryBlock';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import { isCurrentDateBefore2021 } from '../../utils/checkDate2021';

interface Props {
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

const renderApiDataFeil = (feil: FeiloppsummeringFeil) => <span>{feil.feilmelding}</span>;

const OppsummeringStep: React.FC<Props> = ({ onApplicationSent }: Props) => {
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
        person: { fornavn, mellomnavn, etternavn, fødselsnummer },
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
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.barnet.omBarn')}>
                        <SpørsmålOgSvarSummaryView
                            yesNoSpørsmålOgSvar={apiValues.spørsmål.filter((sporsmål: YesNoSpørsmålOgSvar) => {
                                return (
                                    sporsmål.spørsmål ===
                                        intlHelper(intl, 'steg.barn.har_fått_ekstra_omsorgsdager.spm') ||
                                    sporsmål.spørsmål === intlHelper(intl, 'steg.barn.fosterbarn.spm')
                                );
                            })}
                        />

                        {fosterbarn.length > 0 && (
                            <SummaryBlock header="Fosterbarn">
                                <SummaryList
                                    items={fosterbarn}
                                    itemRenderer={(barn: FosterbarnApi) => <>{barn.fødselsnummer}</>}
                                />
                            </SummaryBlock>
                        )}
                    </SummarySection>

                    {/* Omsorgsdager du søker utbetaling for */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.utbetalinger.header')}>
                        <UtbetalingsperioderSummaryView utbetalingsperioder={apiValues.utbetalingsperioder} />

                        {isFeatureEnabled(Feature.STENGT_BHG_SKOLE) && apiValues.hjemmePgaStengtBhgSkole !== undefined && (
                            <Box margin="s">
                                <SummaryBlock
                                    header={
                                        isCurrentDateBefore2021()
                                            ? intlHelper(intl, 'step.periode.spm.hjemmePgaStengtBhgSkole')
                                            : intlHelper(intl, 'step.periode.spm.hjemmePgaStengtBhgSkole.2021')
                                    }>
                                    <JaNeiSvar harSvartJa={apiValues.hjemmePgaStengtBhgSkole} />
                                </SummaryBlock>
                            </Box>
                        )}

                        <Box margin="s">
                            <SummaryBlock header={intlHelper(intl, 'steg.intro.form.spm.smittevernhensyn')}>
                                <JaNeiSvar harSvartJa={apiValues.hjemmePgaSmittevernhensyn} />
                            </SummaryBlock>
                        </Box>

                        <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />
                    </SummarySection>

                    {/* Frilansinntekt */}
                    <FrilansSummary frilans={apiValues.frilans} />

                    {/* Næringsinntekt */}
                    <SelvstendigSummary selvstendigVirksomheter={apiValues.selvstendigVirksomheter} />

                    {/* Eventuelle andre inntekter */}
                    <SummarySection header={intlHelper(intl, 'summary.andreIntekter.header')}>
                        <SpørsmålOgSvarSummaryView
                            yesNoSpørsmålOgSvar={apiValues.spørsmål.filter((sporsmål: YesNoSpørsmålOgSvar) => {
                                return (
                                    sporsmål.spørsmål === intlHelper(intl, 'step.inntekt.er_arbeidstaker') ||
                                    sporsmål.spørsmål ===
                                        intlHelper(intl, 'step.periode.har_søkt_andre_utbetalinger.spm')
                                );
                            })}
                        />
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
                    </SummarySection>

                    {/* Medlemskap i folketrygden */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.medlemskap.header')}>
                        <MedlemskapSummaryView bosteder={apiValues.bosteder} />
                    </SummarySection>

                    {/* Vedlegg */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                        {apiValues.hjemmePgaSmittevernhensyn && (
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
                        {apiValues.hjemmePgaStengtBhgSkole && (
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
                        {!apiValues.hjemmePgaSmittevernhensyn && !apiValues.hjemmePgaStengtBhgSkole && (
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
