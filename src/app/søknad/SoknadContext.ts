import { createContext, useContext } from 'react';
import { initial } from '@devexperts/remote-data-ts';
import {
    SendSoknadStatusInterface,
    SoknadContextInterface,
} from '@navikt/sif-common-soknad/lib/soknad-context/SoknadContext';
import { SøknadApiData } from '../types/SøknadApiData';
import { StepID } from './soknadStepsConfig';

export type SendSoknadStatus = SendSoknadStatusInterface<SøknadApiData>;
export type SoknadContext = SoknadContextInterface<StepID, SøknadApiData>;

const soknadContext = createContext<SoknadContextInterface<StepID, SøknadApiData> | undefined>(undefined);
export const SoknadContextProvider = soknadContext.Provider;
export const SoknadContextConsumer = soknadContext.Consumer;

export const useSoknadContext = () => {
    const context = useContext(soknadContext);
    if (context === undefined) {
        throw new Error('useSoknadContext needs to be called within a SoknadContext');
    }
    return context;
};

export const initialSendSoknadState: SendSoknadStatus = {
    failures: 0,
    status: initial,
};
