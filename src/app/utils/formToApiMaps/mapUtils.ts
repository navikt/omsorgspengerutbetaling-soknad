import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { AnnetBarn, BarnType } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { ApiBarn, RegisterteBarnTypeApi } from '../../types/SøknadApiData';
import { Barn } from '../../types/Søkerdata';
import { dateToISODate } from '@navikt/sif-common-utils';

export const mapAndreBarnToApiBarn = (
    annetBarn: AnnetBarn,
    harUtvidetRettFor: string[],
    harDekketTiFørsteDagerSelv?: boolean
): ApiBarn => {
    return {
        aktørId: undefined,
        identitetsnummer: annetBarn.fnr,
        navn: annetBarn.navn,
        fødselsdato: dateToISODate(annetBarn.fødselsdato),
        utvidetRett: harDekketTiFørsteDagerSelv
            ? undefined
            : harUtvidetRettFor.filter((fnr) => fnr === annetBarn.fnr).length === 1,
        type: annetBarn.type ? annetBarn.type : BarnType.annet,
    };
};

export const mapBarnToApiBarn = (
    registrertBarn: Barn,
    harUtvidetRettFor: string[],
    harDekketTiFørsteDagerSelv?: boolean
): ApiBarn => {
    return {
        identitetsnummer: undefined,
        aktørId: registrertBarn.aktørId,
        navn: formatName(registrertBarn.fornavn, registrertBarn.etternavn, registrertBarn.mellomnavn),
        fødselsdato: dateToISODate(registrertBarn.fødselsdato),
        utvidetRett: harDekketTiFørsteDagerSelv
            ? undefined
            : harUtvidetRettFor.filter((aktørId) => aktørId === registrertBarn.aktørId).length === 1,
        type: RegisterteBarnTypeApi.fraOppslag,
    };
};
