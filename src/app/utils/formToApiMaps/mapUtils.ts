import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { ApiBarn } from '../../types/SøknadApiData';
import { Barn } from '../../types/Søkerdata';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const mapAndreBarnToApiBarn = (
    annetBarn: AnnetBarn,
    harUtvidetRettFor: string[],
    harDekketTiFørsteDagerSelv?: boolean
): ApiBarn => {
    return {
        aktørId: undefined,
        identitetsnummer: annetBarn.fnr,
        navn: annetBarn.navn,
        fødselsdato: formatDateToApiFormat(annetBarn.fødselsdato),
        utvidetRett: harDekketTiFørsteDagerSelv
            ? undefined
            : harUtvidetRettFor.filter((fnr) => fnr === annetBarn.fnr).length === 1,
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
        fødselsdato: formatDateToApiFormat(registrertBarn.fødselsdato),
        utvidetRett: harDekketTiFørsteDagerSelv
            ? undefined
            : harUtvidetRettFor.filter((aktørId) => aktørId === registrertBarn.aktørId).length === 1,
    };
};
