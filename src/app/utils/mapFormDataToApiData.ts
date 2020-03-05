import { getCountryName } from 'common/components/country-select/CountrySelect';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { Locale } from 'common/types/Locale';
import { YesOrNo } from 'common/types/YesOrNo';
import { attachmentUploadHasFailed } from 'common/utils/attachmentUtils';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { formatName } from 'common/utils/personUtils';
import {
    BarnToSendToApi,
    OmsorgspengesøknadApiData,
    UtenlandsoppholdApiData
} from '../types/OmsorgspengesøknadApiData';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import {Barn} from "../../@types/omsorgspengerutbetaling-schema";

export const mapFormDataToApiData = (
    {
        kroniskEllerFunksjonshemming,
        sammeAdresse,
        erYrkesaktiv,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsFødselsdato,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        søkersRelasjonTilBarnet,
        legeerklæring,
        samværsavtale,
        harBoddUtenforNorgeSiste12Mnd,
        arbeidssituasjon,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
        utenlandsoppholdSiste12Mnd
    }: OmsorgspengesøknadFormData,
    barn: Barn[],
    sprak: Locale
): OmsorgspengesøknadApiData => {
    // const barnObject: BarnToSendToApi = { navn: null, norskIdentifikator: null, alternativId: null, aktørId: null };

    const barnObject: BarnToSendToApi = mapBarnToApiData(
        barn,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsFødselsdato,
        barnetSøknadenGjelder
    );

    const apiData: OmsorgspengesøknadApiData = {
        newVersion: true,
        språk: (sprak as any) === 'en' ? 'nn' : sprak,
        kroniskEllerFunksjonshemming: kroniskEllerFunksjonshemming === YesOrNo.YES,
        erYrkesaktiv: erYrkesaktiv === YesOrNo.YES,
        barn: barnObject,
        relasjonTilBarnet: barnObject.aktørId ? undefined : søkersRelasjonTilBarnet,
        sammeAdresse: sammeAdresse === YesOrNo.YES,
        arbeidssituasjon,
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
        samværsavtale:
            samværsavtale && samværsavtale.length > 0
                ? samværsavtale.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!)
                : undefined,
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

export const mapBarnToApiData = (
    barn: Barn[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetsFødselsdato: Date | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnToSendToApi => {
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder)!;
        const { fornavn, etternavn, mellomnavn, aktørId } = barnChosenFromList;
        return {
            navn: formatName(fornavn, etternavn, mellomnavn || undefined),
            norskIdentifikator: null,
            aktørId,
            fødselsdato: formatDateToApiFormat(new Date(barnChosenFromList.fødselsdato))
        };
    } else {
        return {
            navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
            norskIdentifikator: barnetsFødselsnummer || null,
            aktørId: null,
            fødselsdato: barnetsFødselsdato !== undefined ? formatDateToApiFormat(barnetsFødselsdato) : null
        };
    }
};
