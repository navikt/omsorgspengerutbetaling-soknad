import React from 'react';
import Box from 'common/components/box/Box';
import { YesNoSpørsmålOgSvar } from '../../../types/SøknadApiData';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

export interface Props {
    yesNoSpørsmålOgSvar: YesNoSpørsmålOgSvar[];
}

export const SpørsmålOgSvarSummaryView = (props: Props) => {
    const { yesNoSpørsmålOgSvar } = props;
    return (
        <Box margin="l">
            {yesNoSpørsmålOgSvar.map((sporsmål: YesNoSpørsmålOgSvar, index: number) => {
                return (
                    <Box margin="s" key={`spørsmålOgSvarView${index}`}>
                        <SummaryBlock header={sporsmål.spørsmål}>
                            <JaNeiSvar harSvartJa={sporsmål.svar} />
                        </SummaryBlock>
                    </Box>
                );
            })}
        </Box>
    );
};
