import React from 'react';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ApiBarn, RegisterteBarnTypeApi } from '../../../types/SøknadApiData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { BarnType } from '@navikt/sif-common-forms/lib/annet-barn/types';

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
                    const fnr = identitetsnummer ? identitetsnummer : '';
                    const harUtvidetRett = utvidetRett
                        ? intlHelper(intl, 'step.oppsummering.dineBarn.listItem.utvidetRett')
                        : '';
                    const barnType =
                        type !== BarnType.annet && type !== RegisterteBarnTypeApi.fraOppslag
                            ? intlHelper(intl, `step.oppsummering.dineBarn.listItem.årsak.${type}`)
                            : '';
                    const punktum = type === RegisterteBarnTypeApi.fraOppslag && utvidetRett ? '.' : '';
                    return <>{`${navn}${punktum} ${fnr} ${barnType} ${harUtvidetRett}`}</>;
                }}
            />
        </Box>
    );
};

export default DineBarnSummaryList;
