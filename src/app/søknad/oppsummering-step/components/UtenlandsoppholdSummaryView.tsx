import React from 'react';
import { IntlShape } from 'react-intl';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import SummaryList from 'common/components/summary-list/SummaryList';
import intlHelper from 'common/utils/intlUtils';
import { UtenlandsoppholdApiData } from '../../../types/SøknadApiData';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';

export interface Props {
    intl: IntlShape;
    utenlandsopphold: UtenlandsoppholdApiData[];
}

const UtenlandsoppholdSummaryView = (props: Props) => {
    const { utenlandsopphold, intl } = props;
    return utenlandsopphold && utenlandsopphold.length > 0 ? (
        <Box margin="l">
            <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utenlandsoppholdIPerioden.listetittel')}>
                <SummaryList items={utenlandsopphold} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
            </ContentWithHeader>
        </Box>
    ) : null;
};

export default UtenlandsoppholdSummaryView;
