import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import {
    legeerklæringStepIsValid, medlemskapStepIsValid, welcomingPageIsValid
} from '../stepValidations';

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

const formData: Partial<SøknadFormData> = {};

describe('stepValidation tests', () => {
    describe('welcomingPageIsValid', () => {
        it(`should be valid if ${SøknadFormField.harForståttRettigheterOgPlikter} is true`, () => {
            formData[SøknadFormField.harForståttRettigheterOgPlikter] = true;
            expect(welcomingPageIsValid(formData as SøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${SøknadFormField.harForståttRettigheterOgPlikter} is undefined or false`, () => {
            formData[SøknadFormField.harForståttRettigheterOgPlikter] = undefined;
            expect(welcomingPageIsValid(formData as SøknadFormData)).toBe(false);
            formData[SøknadFormField.harForståttRettigheterOgPlikter] = false;
            expect(welcomingPageIsValid(formData as SøknadFormData)).toBe(false);
        });
    });

    describe('medlemskapStepIsValid', () => {
        it('should be valid if both harBoddUtenforNorgeSiste12Mnd and skalBoUtenforNorgeNeste12Mnd are either answered with YES or NO', () => {
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${SøknadFormField.harBoddUtenforNorgeSiste12Mnd} is UNANSWERED`, () => {
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.UNANSWERED;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${SøknadFormField.skalBoUtenforNorgeNeste12Mnd} is UNANSWERED`, () => {
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.UNANSWERED;
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
        });
    });

    describe('legeerklæringStepIsValid', () => {
        it('should always be valid', () => {
            expect(legeerklæringStepIsValid()).toBe(true);
        });
    });
});
