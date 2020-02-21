import { YesOrNo } from 'common/types/YesOrNo';
import { AppFormField, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import * as fieldValidations from '../fieldValidations';
import {
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    welcomingPageIsValid
} from '../stepValidations';

import Mock = jest.Mock;
jest.mock('./../fieldValidations', () => {
    return {
        validateRelasjonTilBarnet: jest.fn(() => undefined),
        validateNavn: jest.fn(() => undefined),
        validateFødselsnummer: jest.fn(() => undefined),
        validateValgtBarn: jest.fn(() => undefined)
    };
});

jest.mock('./../../utils/featureToggleUtils', () => {
    return { isFeatureEnabled: () => false, Feature: {} };
});

const formData: Partial<OmsorgspengesøknadFormData> = {};

describe('stepValidation tests', () => {
    describe('welcomingPageIsValid', () => {
        it(`should be valid if ${AppFormField.harForståttRettigheterOgPlikter} is true and ${AppFormField.kroniskEllerFunksjonshemming} is YES`, () => {
            formData[AppFormField.harForståttRettigheterOgPlikter] = true;
            formData[AppFormField.kroniskEllerFunksjonshemming] = YesOrNo.YES;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${AppFormField.harForståttRettigheterOgPlikter} is undefined or false`, () => {
            formData[AppFormField.harForståttRettigheterOgPlikter] = undefined;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            formData[AppFormField.harForståttRettigheterOgPlikter] = false;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
        });
        it(`should be invalid if ${AppFormField.kroniskEllerFunksjonshemming} is undefined`, () => {
            formData[AppFormField.kroniskEllerFunksjonshemming] = YesOrNo.NO;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmBarnetStepIsValid', () => {
        describe(`when ${AppFormField.barnetHarIkkeFåttFødselsnummerEnda} is true`, () => {
            beforeEach(() => {
                formData[AppFormField.barnetHarIkkeFåttFødselsnummerEnda] = true;
            });

            it(`should be invalid if ${AppFormField.søkersRelasjonTilBarnet} is invalid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            });

            it(`should be valid if ${AppFormField.søkersRelasjonTilBarnet} is valid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue(undefined);
                expect(opplysningerOmBarnetStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
            });
        });

        describe(`when ${AppFormField.barnetHarIkkeFåttFødselsnummerEnda} is false`, () => {
            beforeEach(() => {
                formData[AppFormField.barnetHarIkkeFåttFødselsnummerEnda] = false;
                jest.resetAllMocks();
            });

            it('should be valid if barnetsNavn, barnetsFødselsnummer and are all valid', () => {
                expect(opplysningerOmBarnetStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
            });

            it(`should be invalid if ${AppFormField.barnetsNavn} is invalid`, () => {
                (fieldValidations.validateNavn as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${AppFormField.barnetsFødselsnummer} is invalid`, () => {
                (fieldValidations.validateFødselsnummer as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${AppFormField.søkersRelasjonTilBarnet} is invalid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            });
        });
    });

    describe('medlemskapStepIsValid', () => {
        it('should be valid if both harBoddUtenforNorgeSiste12Mnd and skalBoUtenforNorgeNeste12Mnd are either answered with YES or NO', () => {
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${AppFormField.harBoddUtenforNorgeSiste12Mnd} is UNANSWERED`, () => {
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.UNANSWERED;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${AppFormField.skalBoUtenforNorgeNeste12Mnd} is UNANSWERED`, () => {
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.UNANSWERED;
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
        });
    });

    describe('legeerklæringStepIsValid', () => {
        it('should always be valid', () => {
            expect(legeerklæringStepIsValid()).toBe(true);
        });
    });
});
