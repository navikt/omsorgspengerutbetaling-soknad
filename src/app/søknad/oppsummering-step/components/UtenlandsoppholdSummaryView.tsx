import React from 'react';
import { useIntl } from 'react-intl';
import SummaryList from 'common/components/summary-list/SummaryList';
import intlHelper from 'common/utils/intlUtils';
import { UtenlandsoppholdApiData } from '../../../types/SøknadApiData';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from './SummaryBlock';

export interface Props {
    utenlandsopphold: UtenlandsoppholdApiData[];
}

const UtenlandsoppholdSummaryView = ({ utenlandsopphold }: Props) => {
    const intl = useIntl();
    return utenlandsopphold && utenlandsopphold.length > 0 ? (
        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utenlandsoppholdIPerioden.listetittel')}>
            <SummaryList items={utenlandsopphold} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
        </SummaryBlock>
    ) : null;
};

export default UtenlandsoppholdSummaryView;
