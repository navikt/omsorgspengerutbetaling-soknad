import { countryIsMemberOfEøsOrEfta, getCountryName } from '@navikt/sif-common-formik/lib';
import { BostedUtland } from '@navikt/sif-common-forms/lib';
import { dateToISODate } from '@navikt/sif-common-utils';
import { UtenlandsoppholdApiData } from '../../types/SøknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): UtenlandsoppholdApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: dateToISODate(opphold.fom),
    tilOgMed: dateToISODate(opphold.tom),
    erEØSLand: countryIsMemberOfEøsOrEfta(opphold.landkode),
});
