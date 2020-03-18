import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { MedlemskapApiData } from '../../../../types/SøknadApiData';
import { renderUtenlandsoppholdSummary } from './summary-renderers/renderUtenlandsoppholdSummary';

interface Props {
    medlemskap: MedlemskapApiData;
}

const MedlemsskapSummary: React.FunctionComponent<Props> = ({ medlemskap }) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                    {medlemskap.harBoddIUtlandetSiste12Mnd === true && intlHelper(intl, 'Ja')}
                    {medlemskap.harBoddIUtlandetSiste12Mnd === false && intlHelper(intl, 'Nei')}
                </ContentWithHeader>
            </Box>
            {medlemskap.harBoddIUtlandetSiste12Mnd === true && medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                <Box margin="l">
                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.liste.header')}>
                        <SummaryList
                            items={medlemskap.utenlandsoppholdSiste12Mnd}
                            itemRenderer={renderUtenlandsoppholdSummary}
                        />
                    </ContentWithHeader>
                </Box>
            )}

            <Box margin="l">
                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                    {medlemskap.skalBoIUtlandetNeste12Mnd === true && intlHelper(intl, 'Ja')}
                    {medlemskap.skalBoIUtlandetNeste12Mnd === false && intlHelper(intl, 'Nei')}
                </ContentWithHeader>
            </Box>

            {medlemskap.skalBoIUtlandetNeste12Mnd === true && medlemskap.utenlandsoppholdNeste12Mnd.length > 0 && (
                <Box margin="l">
                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.liste.header')}>
                        <SummaryList
                            items={medlemskap.utenlandsoppholdNeste12Mnd}
                            itemRenderer={renderUtenlandsoppholdSummary}
                        />
                    </ContentWithHeader>
                </Box>
            )}
        </>
    );
};

export default MedlemsskapSummary;
