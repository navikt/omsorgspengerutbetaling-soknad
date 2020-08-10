import React from 'react';
import { Frilans } from '../../../types/SøknadApiData';
import DatoSvar from './DatoSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    frilans?: Frilans;
}

const FrilansSummary: React.FunctionComponent<Props> = ({ frilans }: Props) => {
    if (frilans) {
        return (
            <>
                <SummaryBlock header="Frilanser">
                    Startet som frilanser <DatoSvar apiDato={frilans.startdato} />.{' '}
                    {frilans.jobberFortsattSomFrilans
                        ? 'Jobber fortsatt som frilanser'
                        : 'Jobber ikke som frilanser nå'}
                    .
                </SummaryBlock>
            </>
        );
    }
    return null;
};

export default FrilansSummary;
