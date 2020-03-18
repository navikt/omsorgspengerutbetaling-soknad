import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { getCountryName } from '@navikt/sif-common-formik/lib';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { attachmentUploadHasFailed } from 'common/utils/attachmentUtils';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { OmsorgspengesøknadApiData, UtenlandsoppholdApiData } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';

export const mapFormDataToApiData = (
    // TODO: FIX MAPPING!!!
    {
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,

        legeerklæring,

        harBoddUtenforNorgeSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
        utenlandsoppholdSiste12Mnd
    }: SøknadFormData,
    sprak: Locale
): OmsorgspengesøknadApiData => {
    const apiData: OmsorgspengesøknadApiData = {
        newVersion: true,
        språk: (sprak as any) === 'en' ? 'nn' : sprak,

        medlemskap: {
            harBoddIUtlandetSiste12Mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
            skalBoIUtlandetNeste12Mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
            utenlandsoppholdSiste12Mnd:
                harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdSiste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
                    : [],
            utenlandsoppholdNeste12Mnd:
                skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdNeste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
                    : []
        },

        legeerklæring: legeerklæring
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            .map(({ url }) => url!),

        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter
    };

    return apiData;
};

const mapUtenlandsoppholdTilApiData = (opphold: Utenlandsopphold, locale: string): UtenlandsoppholdApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom)
});
