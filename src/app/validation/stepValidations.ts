import { YesOrNo } from 'common/types/YesOrNo';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import * as fieldValidations from './fieldValidations';

export const welcomingPageIsValid = ({
    harForståttRettigheterOgPlikter,
    kroniskEllerFunksjonshemming
}: OmsorgspengesøknadFormData) =>
    kroniskEllerFunksjonshemming === YesOrNo.YES && harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetHarIkkeFåttFødselsnummerEnda,
    søkersRelasjonTilBarnet,
    barnetSøknadenGjelder
}: OmsorgspengesøknadFormData) => {
    if (barnetHarIkkeFåttFødselsnummerEnda) {
        return fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;
    }

    const formIsValid =
        fieldValidations.validateNavn(barnetsNavn) === undefined &&
        fieldValidations.validateFødselsnummer(barnetsFødselsnummer) === undefined &&
        fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return fieldValidations.validateValgtBarn(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const arbeidStepIsValid = ({ arbeidssituasjon }: OmsorgspengesøknadFormData) =>
    arbeidssituasjon !== undefined && arbeidssituasjon.length > 0;

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: OmsorgspengesøknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
