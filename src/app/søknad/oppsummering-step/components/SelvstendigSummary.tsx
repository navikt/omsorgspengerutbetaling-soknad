import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import SummarySection from '../../../components/summary-section/SummarySection';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    virksomhet?: VirksomhetApiData;
    harFlereVirksomheter: boolean | undefined;
}

const SelvstendigSummary: React.FunctionComponent<Props> = ({ virksomhet, harFlereVirksomheter }) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'summary.virksomhet.header')}>
            <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={virksomhet !== undefined} />
            </SummaryBlock>
            <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harFlereVirksomheter.header')}>
                <JaNeiSvar harSvartJa={harFlereVirksomheter} />
            </SummaryBlock>
            {virksomhet && (
                <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}>
                    <VirksomhetSummary virksomhet={virksomhet} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default SelvstendigSummary;
