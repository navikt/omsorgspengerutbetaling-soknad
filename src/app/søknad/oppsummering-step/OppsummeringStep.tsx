import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { sendApplication } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import FormikStep from '../SøknadStep';
import FrilansSummary from './components/FrilansSummary';
import SelvstendigSummary from './components/SelvstendigSummary';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import { SpørsmålOgSvarSummaryView } from './components/SporsmalOgSvarSummaryView';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdSummaryView from './components/UtenlandsoppholdSummaryView';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';

interface Props {
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

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
    // const apiValues: SøknadApiData = mock1;

    return (
        <FormikStep
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
                    <NavnOgFodselsnummerSummaryView
                        intl={intl}
                        fornavn={fornavn}
                        etternavn={etternavn}
                        mellomnavn={mellomnavn}
                        fødselsnummer={fødselsnummer}
                    />
                    <SpørsmålOgSvarSummaryView yesNoSpørsmålOgSvar={apiValues.spørsmål} />
                    <UtbetalingsperioderSummaryView intl={intl} utbetalingsperioder={apiValues.utbetalingsperioder} />
                    <UtenlandsoppholdSummaryView intl={intl} utenlandsopphold={apiValues.opphold} />
                    <FrilansSummary apiValues={apiValues} />
                    <SelvstendigSummary apiValues={apiValues} />
                    <MedlemskapSummaryView intl={intl} bosteder={apiValues.bosteder} />
                </Panel>
            </Box>

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
        </FormikStep>
    );
};

export default OppsummeringStep;
