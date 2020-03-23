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
    bosteder: UtenlandsoppholdApiData[];
}

const MedlemskapSummaryView = (props: Props) => {
    const { intl, bosteder } = props;

    return (
        <div>
            {bosteder.length > 0 && (
                <Box margin="l">
                    <ContentWithHeader
                        header={intlHelper(intl, 'steg.medlemsskap.annetLandSisteOgNeste12.listeTittel')}>
                        <SummaryList items={bosteder} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                    </ContentWithHeader>
                </Box>
            )}
        </div>
    );
};

export default MedlemskapSummaryView;
