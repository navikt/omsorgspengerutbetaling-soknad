import React, { useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import SummaryList from 'common/components/summary-list/SummaryList';
import { Time } from 'common/types/Time';
import bemUtils from 'common/utils/bemUtils';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import { iso8601DurationToTime, timeToString } from 'common/utils/timeUtils';
import { sendApplication } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import {
    SøknadApiData, Utbetalingsperiode, UtbetalingsperiodeMedVedlegg, YesNoSpørsmålOgSvar
} from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FrilansSummary from './components/FrilansSummary';
import { renderUtenlandsoppholdIPeriodenSummary } from './components/renderUtenlandsoppholdSummary';
import SelvstendigSummary from './components/SelvstendigSummary';

interface Props {
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

const booleanToSvarString = (bool: boolean): string => {
    switch (bool) {
        case true:
            return 'Ja';
        case false:
            return 'Nei';
    }
};

const spørsmålOgSvarView = (yesNoSpørsmålOgSvar: YesNoSpørsmålOgSvar[]) => (
    <Box margin={'xl'}>
        <ContentWithHeader header={'Spørsmål og svar'}>
            <div>
                {yesNoSpørsmålOgSvar.map((sporsmål: YesNoSpørsmålOgSvar, index: number) => {
                    return (
                        <Box margin={'s'} key={`spørsmålOgSvarView${index}`}>
                            <span>{sporsmål.spørsmål}:</span>
                            <b> {booleanToSvarString(sporsmål.svar)} </b>
                        </Box>
                    );
                })}
            </div>
        </ContentWithHeader>
    </Box>
);

const partialTimeIsTime = (partialTime: Partial<Time>): partialTime is Time => {
    return true;
};

const utbetalingsperioderView = (utbetalingsperioder: Utbetalingsperiode[], intl: IntlShape) => {
    const bem = bemUtils('summaryList');

    return (
        <Box margin={'xl'}>
            <ContentWithHeader header={'Perioder som det søkes om utbetaling for'}>
                <div>
                    <ul className={bem.classNames(bem.block)}>
                        {utbetalingsperioder.length === 0 && <div>Ingen perioder oppgitt.</div> // TODO: Det skal ikke være mulig å komme til oppsummeringen uten å ha spesifisert noen utbetalingsperioder.
                        }
                        {utbetalingsperioder.map((utbetalingsperiode: UtbetalingsperiodeMedVedlegg, index: number) => {
                            const duration = utbetalingsperiode.lengde;

                            const maybeTime: Partial<Time> | undefined = duration
                                ? iso8601DurationToTime(duration)
                                : undefined;

                            return (
                                <li className={bem.element('item')} key={`utbetalingsperioderView${index}`}>
                                    {maybeTime && partialTimeIsTime(maybeTime) ? (
                                        <>
                                            Dato: {prettifyDate(apiStringDateToDate(utbetalingsperiode.fraOgMed))}.
                                            Antall timer: {timeToString(maybeTime, intl)}.
                                        </>
                                    ) : (
                                        <>
                                            Fra og med {prettifyDate(apiStringDateToDate(utbetalingsperiode.fraOgMed))},
                                            til og med {prettifyDate(apiStringDateToDate(utbetalingsperiode.tilOgMed))}.
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </ContentWithHeader>
        </Box>
    );
};

const utenlandsopphold = (intl: IntlShape, apiValues: SøknadApiData) => (
    <Box margin="l">
        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utenlandsoppholdIPerioden.listetittel')}>
            <SummaryList items={apiValues.opphold} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
        </ContentWithHeader>
    </Box>
);

const navnOgFødselsenummer = (
    intl: IntlShape,
    fornavn: string,
    etternavn: string,
    mellomnavn: string,
    fødselsnummer: string
) => (
    <Box margin={'xl'}>
        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
            <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
            <Normaltekst>
                <FormattedMessage id="steg.oppsummering.søker.fnr" values={{ fødselsnummer }} />
            </Normaltekst>
        </ContentWithHeader>
    </Box>
);

const medlemskap = (intl: IntlShape, apiValues: SøknadApiData) => {
    const { bosteder } = apiValues;

    return (
        <div>
            {bosteder.length > 0 && (
                <Box margin="l">
                    <ContentWithHeader
                        header={intlHelper(intl, 'steg.medlemsskap.annetLandSisteOgNeste12.listeTittel')}>
                        <SummaryList items={bosteder} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                    </ContentWithHeader>
                </Box>
            )}
        </div>
    );
};

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

    return (
        <SøknadStep
            id={StepID.OPPSUMMERING}
            onValidFormSubmit={() => {
                setTimeout(() => {
                    navigate(apiValues, søkerdata); // La view oppdatere seg først
                });
            }}
            useValidationErrorSummary={false}
            buttonDisabled={sendingInProgress}
            showButtonSpinner={sendingInProgress}>
            <CounsellorPanel>
                <FormattedMessage id="steg.oppsummering.info" />
            </CounsellorPanel>
            <Box margin="xl">
                <Panel border={true}>
                    {navnOgFødselsenummer(intl, fornavn, etternavn, mellomnavn, fødselsnummer)}

                    {spørsmålOgSvarView(apiValues.spørsmål)}

                    {utbetalingsperioderView(apiValues.utbetalingsperioder, intl)}

                    {utenlandsopphold(intl, apiValues)}

                    <FrilansSummary apiValues={apiValues} />

                    <SelvstendigSummary apiValues={apiValues} />

                    {medlemskap(intl, apiValues)}
                </Panel>
            </Box>

            {/*<MedlemsskapSummary medlemskap={bosteder} />*/}

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
        </SøknadStep>
    );
};

export default OppsummeringStep;
