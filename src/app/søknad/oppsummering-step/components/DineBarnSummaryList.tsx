import React from 'react';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ApiBarn } from '../../../types/SøknadApiData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    barn: ApiBarn[];
}

const DineBarnSummaryList = ({ barn }: Props) => {
    const intl = useIntl();
    return (
        <Box margin="l">
            <SummaryList
                items={barn}
                itemRenderer={({ identitetsnummer, navn, utvidetRett }: ApiBarn) => {
                    const fnr = identitetsnummer
                        ? intlHelper(intl, 'step.oppsummering.dineBarn.listItem', { identitetsnummer })
                        : '';
                    const harUtvidetRett = utvidetRett
                        ? intlHelper(intl, 'step.oppsummering.dineBarn.listItem.utvidetRett')
                        : '';
                    return <>{`${navn}${fnr} ${harUtvidetRett}`}</>;
                }}
            />
        </Box>
    );
};

export default DineBarnSummaryList;
