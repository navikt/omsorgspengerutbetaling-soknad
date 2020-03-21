import React from 'react';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import DatoSvar from './DatoSvar';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';
import { Frilans, SøknadApiData } from '../../../types/SøknadApiData';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    apiValues: SøknadApiData;
}

const FrilansSummary: React.FunctionComponent<Props> = (props: Props) => {
    const intl = useIntl();

    const frilans: Frilans | undefined = props.apiValues.frilans;

    if (frilans) {
        return (
            <>
                <Box margin="l">
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                        <JaNeiSvar harSvartJa={true} />
                    </SummaryBlock>
                </Box>
                <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                    <DatoSvar apiDato={frilans.startdato} />
                </SummaryBlock>
                <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                    <JaNeiSvar harSvartJa={frilans.jobberFortsattSomFrilans} />
                </SummaryBlock>
            </>
        );
    }

    return null;
};

export default FrilansSummary;
