import React from 'react';
import { apiStringDateToDate, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import SummaryList from 'common/components/summary-list/SummaryList';
import { UtenlandsoppholdApiData } from '../../../types/SøknadApiData';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from './SummaryBlock';

export interface Props {
    bosteder: UtenlandsoppholdApiData[];
}

const MedlemskapSummaryView = (props: Props) => {
    const { bosteder } = props;

    if (bosteder.length === 0) {
        return null;
    }
    const bostederSiste12 = bosteder.filter((b) => moment(apiStringDateToDate(b.tilOgMed)).isSameOrBefore(dateToday));
    const bostederNeste12 = bosteder.filter((b) => moment(apiStringDateToDate(b.tilOgMed)).isSameOrAfter(dateToday));
    return (
        <>
            {bostederSiste12.length > 0 && (
                <SummaryBlock header="Bosteder i utlandet siste 12 måneder">
                    <SummaryList items={bostederSiste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                </SummaryBlock>
            )}
            {bostederNeste12.length > 0 && (
                <SummaryBlock header="Bosteder i utlandet neste 12 måneder">
                    <SummaryList items={bostederNeste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                </SummaryBlock>
            )}
        </>
    );
};

export default MedlemskapSummaryView;
