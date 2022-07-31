import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';

const BehandlingAvPersonopplysningerContent: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <>
            <Systemtittel tag="h1">
                <FormattedMessage id="modal.personopplysninger.1" />
            </Systemtittel>
            <Box margin="xl">
                <FormattedMessage id="modal.personopplysninger.2" />
            </Box>
            <Box margin="xl">
                <Ingress tag="h2">
                    <FormattedMessage id="modal.personopplysninger.3" />
                </Ingress>
                <p>
                    <FormattedMessage id="modal.personopplysninger.4" />
                </p>
                <ul>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.4.1" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.4.2" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.4.3" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.4.4" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.4.5" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.4.6" />
                    </li>
                </ul>
            </Box>

            <Box margin="xl">
                <Ingress tag="h2">
                    <FormattedMessage id="modal.personopplysninger.5" />
                </Ingress>
                <p>
                    <FormattedMessage id="modal.personopplysninger.6" />
                </p>
                <ul>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.6.1" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.6.2" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personopplysninger.6.3" />
                    </li>
                </ul>
            </Box>
            <Box margin="xl">
                <p>
                    <FormattedMessage id="Vil du vite mer om hvordan NAV behandler personopplysninger? Se " />
                    {` `}
                    <Lenke href={getLenker(intl.locale).personvern} target="_blank">
                        <FormattedMessage id="modal.personopplysninger.7.2" />
                    </Lenke>
                </p>
            </Box>
        </>
    );
};

export default BehandlingAvPersonopplysningerContent;
