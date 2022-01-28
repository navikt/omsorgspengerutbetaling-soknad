import React from 'react';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ApiBarn, RegisterteBarnTypeApi } from '../../../types/SøknadApiData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Årsak } from '@navikt/sif-common-forms/lib/annet-barn/types';

interface Props {
    barn: ApiBarn[];
}

const DineBarnSummaryList = ({ barn }: Props) => {
    const intl = useIntl();
    return (
        <Box margin="l">
            <SummaryList
                items={barn}
                itemRenderer={({ identitetsnummer, navn, utvidetRett, type }: ApiBarn) => {
                    const fnr = identitetsnummer
                        ? intlHelper(intl, 'step.oppsummering.dineBarn.listItem', { identitetsnummer })
                        : '';
                    const harUtvidetRett = utvidetRett
                        ? intlHelper(intl, 'step.oppsummering.dineBarn.listItem.utvidetRett')
                        : '';
                    const barnType =
                        type !== Årsak.annet && type !== RegisterteBarnTypeApi.fraOppslag
                            ? intlHelper(intl, `step.oppsummering.dineBarn.listItem.årsak.${type}`)
                            : '';
                    return <>{`${navn}${fnr} ${harUtvidetRett} ${barnType}`}</>;
                }}
            />
        </Box>
    );
};

export default DineBarnSummaryList;
