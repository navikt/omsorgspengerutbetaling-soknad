import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CheckmarkIcon from '@navikt/sif-common-core/lib/components/checkmark-icon/CheckmarkIcon';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import getLenker from '../../../lenker';
import './confirmationPage.less';

const bem = bemUtils('confirmationPage');

const ConfirmationPage: React.FunctionComponent = () => {
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
                        <FormattedMessage id="page.confirmation.checklist.1" />
                    </li>
                    <li>
                        <FormattedMessage id="page.confirmation.checklist.2.a" />
                        <Lenke
                            href="https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-35.01/ettersendelse"
                            target="_blank">
                            <FormattedMessage id="page.confirmation.checklist.2.b" />
                        </Lenke>
                        .
                    </li>
                    <li>
                        <FormattedMessage id="page.confirmation.checklist.3.a" />
                        <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                            <FormattedMessage id="page.confirmation.checklist.3.b" />
                        </Lenke>
                        .
                    </li>
                </ul>
            </Box>
        </Page>
    );
};

export default ConfirmationPage;
