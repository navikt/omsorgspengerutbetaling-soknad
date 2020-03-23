import { FormattedMessage, IntlShape } from 'react-intl';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import intlHelper from 'common/utils/intlUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { formatName } from 'common/utils/personUtils';
import React from 'react';

export interface Props {
    intl: IntlShape;
    fornavn: string;
    etternavn: string;
    mellomnavn: string;
    fødselsnummer: string;
}

export const NavnOgFodselsnummerSummaryView = (props: Props) => {
    const { fornavn, etternavn, mellomnavn, intl, fødselsnummer } = props;
    return (
        <Box margin={'xl'}>
            <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                <Normaltekst>
                    <FormattedMessage id="steg.oppsummering.søker.fnr" values={{ fødselsnummer }} />
                </Normaltekst>
            </ContentWithHeader>
        </Box>
    );
};

export default NavnOgFodselsnummerSummaryView;
