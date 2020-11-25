import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import { formatName } from 'common/utils/personUtils';

export interface Props {
    fornavn: string;
    etternavn: string;
    mellomnavn: string;
    fødselsnummer: string;
}

export const NavnOgFodselsnummerSummaryView = (props: Props) => {
    const { fornavn, etternavn, mellomnavn, fødselsnummer } = props;
    return (
        <Box margin="l">
            <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
            <Normaltekst>Fødselsnummer: {fødselsnummer}</Normaltekst>
        </Box>
    );
};

export default NavnOgFodselsnummerSummaryView;
