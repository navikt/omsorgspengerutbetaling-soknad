import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import ContentSwitcher from 'common/components/content-switcher/ContentSwitcher';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import SummaryList from 'common/components/summary-list/SummaryList';
import FormikConfirmationCheckboxPanel from 'common/formik/formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';
import { HistoryProps } from 'common/types/History';
import { Locale } from 'common/types/Locale';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';
import { renderUtenlandsoppholdSummary } from 'app/components/summary-renderers/renderUtenlandsoppholdSummary';
import { sendApplication } from '../../../api/api';
import routeConfig from '../../../config/routeConfig';
import { StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi, Søkerdata } from '../../../types/Søkerdata';
import * as apiUtils from '../../../utils/apiUtils';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringAttachmentList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import SamværsavtaleAttachmentList from '../../samværsavtale-attachment-list/SamværsavtaleAttachmentList';

interface State {
    sendingInProgress: boolean;
}

type Props = CommonStepFormikProps & HistoryProps & WrappedComponentProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sendingInProgress: false
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate(barn: BarnReceivedFromApi[]) {
        const { history, formValues, intl } = this.props;
        this.setState({
            sendingInProgress: true
        });
        if (appIsRunningInDemoMode()) {
            navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
        } else {
            try {
                await sendApplication(mapFormDataToApiData(formValues, barn, intl.locale as Locale));
                navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
                }
            }
        }
    }

    render() {
        const { handleSubmit, formValues, history, intl } = this.props;
        const { sendingInProgress } = this.state;
        const stepProps = {
            formValues,
            handleSubmit,
            showButtonSpinner: sendingInProgress,
            buttonDisabled: sendingInProgress
        };

        return (
            <SøkerdataContextConsumer>
                {({ person: { fornavn, mellomnavn, etternavn, fødselsnummer }, barn }: Søkerdata) => {
                    const apiValues = mapFormDataToApiData(formValues, barn, intl.locale as Locale);
                    const { medlemskap } = apiValues;

                    return (
                        <FormikStep
                            id={StepID.SUMMARY}
                            onValidFormSubmit={() => this.navigate(barn)}
                            history={history}
                            useValidationErrorSummary={false}
                            {...stepProps}>
                            <CounsellorPanel>
                                <FormattedMessage id="steg.oppsummering.info" />
                            </CounsellorPanel>
                            <Box margin="xl">
                                <Panel border={true}>
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                        <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="steg.oppsummering.søker.fnr"
                                                values={{ fødselsnummer }}
                                            />
                                        </Normaltekst>
                                    </ContentWithHeader>

                                    <Box margin="l">
                                        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                                            <ContentSwitcher
                                                firstContent={() => {
                                                    const barnReceivedFromApi = barn.find(
                                                        ({ aktørId }) => aktørId === formValues.barnetSøknadenGjelder
                                                    );
                                                    return barnReceivedFromApi ? (
                                                        <>
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.navn"
                                                                    values={{
                                                                        navn: formatName(
                                                                            barnReceivedFromApi!.fornavn,
                                                                            barnReceivedFromApi!.etternavn,
                                                                            barnReceivedFromApi!.mellomnavn
                                                                        )
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.fødselsdato"
                                                                    values={{
                                                                        dato: prettifyDate(
                                                                            barnReceivedFromApi!.fødselsdato
                                                                        )
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    );
                                                }}
                                                secondContent={() => (
                                                    <>
                                                        {apiValues.barn.fødselsdato ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.fødselsdato"
                                                                    values={{
                                                                        dato: prettifyDate(
                                                                            apiStringDateToDate(
                                                                                apiValues.barn.fødselsdato
                                                                            )
                                                                        )
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        {apiValues.barn.navn ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.navn"
                                                                    values={{ navn: apiValues.barn.navn }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.søkersRelasjonTilBarnet"
                                                                values={{
                                                                    relasjon: intlHelper(
                                                                        intl,
                                                                        `relasjonTilBarnet.${apiValues.relasjonTilBarnet}`
                                                                    )
                                                                }}
                                                            />
                                                        </Normaltekst>
                                                    </>
                                                )}
                                                showFirstContent={
                                                    !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0
                                                }
                                            />
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.barnet.sammeAdresse.header')}>
                                            {apiValues.sammeAdresse === true && intlHelper(intl, 'Ja')}
                                            {apiValues.sammeAdresse === false && intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
                                            {apiValues.arbeidssituasjon.map((a) => (
                                                <li key={a}>
                                                    <FormattedMessage id={`arbeidssituasjon.${a}`} />
                                                </li>
                                            ))}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                            {medlemskap.harBoddIUtlandetSiste12Mnd === true && intlHelper(intl, 'Ja')}
                                            {medlemskap.harBoddIUtlandetSiste12Mnd === false && intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                        medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetSiste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsoppholdSiste12Mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                        medlemskap.utenlandsoppholdNeste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetNeste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsoppholdNeste12Mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.samværsavtale && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samværsavtale.header')}>
                                                <SamværsavtaleAttachmentList includeDeletionFunctionality={false} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}
                                </Panel>
                            </Box>
                            <Box margin="l">
                                <FormikConfirmationCheckboxPanel<AppFormField>
                                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                    name={AppFormField.harBekreftetOpplysninger}
                                    validate={(value) => {
                                        let result;
                                        if (value !== true) {
                                            result = intlHelper(
                                                intl,
                                                'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet'
                                            );
                                        }
                                        return result;
                                    }}
                                />
                            </Box>
                        </FormikStep>
                    );
                }}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(SummaryStep);
