import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { ISODateToDate, dateToday } from '@navikt/sif-common-utils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { UtenlandsoppholdApiData } from '../../../types/SøknadApiData';
import JaNeiSvar from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/JaNeiSvar';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export interface Props {
    bosteder: UtenlandsoppholdApiData[];
}

const MedlemskapSummaryView: React.FunctionComponent<Props> = (props) => {
    const { bosteder } = props;
    const intl = useIntl();

    const bostederSiste12 = bosteder.filter((b) => dayjs(ISODateToDate(b.tilOgMed)).isSameOrBefore(dateToday));
    const bostederNeste12 = bosteder.filter((b) => dayjs(ISODateToDate(b.tilOgMed)).isSameOrAfter(dateToday));
    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                <JaNeiSvar harSvartJa={bostederSiste12.length > 0} />
            </SummaryBlock>
            {bostederSiste12.length > 0 && (
                <Box margin="m">
                    <SummaryList items={bostederSiste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                </Box>
            )}
            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                <JaNeiSvar harSvartJa={bostederNeste12.length > 0} />
            </SummaryBlock>
            {bostederNeste12.length > 0 && (
                <Box margin="m">
                    <SummaryList items={bostederNeste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                </Box>
            )}
        </>
    );
};

export default MedlemskapSummaryView;
