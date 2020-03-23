import { YesNoSpørsmålOgSvar } from '../../../types/SøknadApiData';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import React from 'react';

const booleanToSvarString = (bool: boolean): string => {
    switch (bool) {
        case true:
            return 'Ja';
        case false:
            return 'Nei';
    }
};

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
                                <span>{sporsmål.spørsmål}:</span>
                                <b> {booleanToSvarString(sporsmål.svar)} </b>
                            </Box>
                        );
                    })}
                </div>
            </ContentWithHeader>
        </Box>
    );
};
