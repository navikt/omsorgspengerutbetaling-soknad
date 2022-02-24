import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { Barn } from '../../types/Søkerdata';
import { ApiBarn } from '../../types/SøknadApiData';
import { mapAndreBarnToApiBarn, mapBarnToApiBarn } from './mapUtils';

export const mapBarnToApiData = (
    andreBarn: AnnetBarn[],
    harUtvidetRettFor: string[],
    registrerteBarn: Barn[],
    harDekketTiFørsteDagerSelv?: boolean
): ApiBarn[] => {
    const barn: ApiBarn[] = [
        ...andreBarn.map((barn) => mapAndreBarnToApiBarn(barn, harUtvidetRettFor, harDekketTiFørsteDagerSelv)),
        ...registrerteBarn.map((barn) => mapBarnToApiBarn(barn, harUtvidetRettFor, harDekketTiFørsteDagerSelv)),
    ];
    return barn;
};
