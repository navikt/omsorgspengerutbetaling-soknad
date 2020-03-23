import { IntlShape } from 'react-intl';
import { UtenlandsoppholdApiData } from '../../../types/SøknadApiData';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import intlHelper from 'common/utils/intlUtils';
import SummaryList from 'common/components/summary-list/SummaryList';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import React from 'react';

export interface Props {
    intl: IntlShape;
    utenlandsopphold: UtenlandsoppholdApiData[];
}

const UtenlandsoppholdSummaryView = (props: Props) => {
    const { utenlandsopphold, intl } = props;
    return (
        <Box margin="l">
            <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utenlandsoppholdIPerioden.listetittel')}>
                <SummaryList items={utenlandsopphold} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
            </ContentWithHeader>
        </Box>
    );
};

export default UtenlandsoppholdSummaryView;
