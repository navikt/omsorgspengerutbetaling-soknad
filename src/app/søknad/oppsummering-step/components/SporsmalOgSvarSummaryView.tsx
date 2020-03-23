import { YesNoSpørsmålOgSvar } from '../../../types/SøknadApiData';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import React from 'react';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

export interface Props {
    yesNoSpørsmålOgSvar: YesNoSpørsmålOgSvar[];
}

export const SpørsmålOgSvarSummaryView = (props: Props) => {
    const { yesNoSpørsmålOgSvar } = props;
    return (
        <Box margin={'xl'}>
            <ContentWithHeader header={'Spørsmål og svar'}>
                <div>
                    {yesNoSpørsmålOgSvar.map((sporsmål: YesNoSpørsmålOgSvar, index: number) => {
                        return (
                            <Box margin={'s'} key={`spørsmålOgSvarView${index}`}>
                                <SummaryBlock header={sporsmål.spørsmål}>
                                    <JaNeiSvar harSvartJa={sporsmål.svar} />
                                </SummaryBlock>
                            </Box>
                        );
                    })}
                </div>
            </ContentWithHeader>
        </Box>
    );
};
