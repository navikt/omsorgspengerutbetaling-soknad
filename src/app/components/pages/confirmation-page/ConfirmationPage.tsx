import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from 'app/lenker';
import { KvitteringInfo } from '../../../søknad/SøknadRoutes';
import './confirmationPage.less';
import Lenke from 'nav-frontend-lenker';

const bem = bemUtils('confirmationPage');

interface Props {
    kvitteringInfo?: KvitteringInfo;
}

const ConfirmationPage: React.FunctionComponent<Props> = ({ kvitteringInfo }) => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>
                        <FormattedMessage id="page.confirmation.tittel" />
                    </Innholdstittel>
                </Box>
            </div>
            <Box margin="xl">
                <Ingress>
                    <FormattedMessage id="page.confirmation.undertittel" />
                </Ingress>
                <ul className="checklist">
                    <li>
                        Søknaden din vil bli synlig på Ditt NAV etter omkring en uke. Da vil du også kunne se hva slags
                        dokumentasjon vi har fått fra deg.
                    </li>
                    <li>
                        Vi starter behandlingen av søknaden din når vi har mottatt all nødvendig dokumentasjon. Vi
                        kontakter deg hvis vi trenger flere opplysninger i saken din. Hvis du skal{' '}
                        <Lenke
                            href="https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-35.01/ettersendelse"
                            target="_blank">
                            ettersende dokumentasjon kan du gjøre det her
                        </Lenke>
                        .
                    </li>
                    <li>
                        Når søknaden er ferdig behandlet, får du et svarbrev fra oss. Du kan se{' '}
                        <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                            saksbehandlingstiden
                        </Lenke>{' '}
                        for ditt fylke her.
                    </li>
                </ul>
            </Box>
        </Page>
    );
};

export default ConfirmationPage;
