import React from 'react';
import { Frilans } from '../../../types/SøknadApiData';
import DatoSvar from './DatoSvar';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import SummaryBlock from './SummaryBlock';
import JaNeiSvar from './JaNeiSvar';

interface Props {
    frilans?: Frilans;
}

const FrilansSummary: React.FunctionComponent<Props> = ({ frilans }: Props) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'frilanser.summary.header')}>
            <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={frilans !== undefined} />
            </SummaryBlock>

            {frilans && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilans.jobberFortsattSomFrilans} />
                    </SummaryBlock>
                </>
            )}
        </SummarySection>
    );
};

export default FrilansSummary;
