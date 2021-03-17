import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { frilansIsValid, selvstendigIsValid } from '../../søknad/arbeidssituasjon-step/arbeidssituasjonUtils';
import { FrilansFormData, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { legeerklæringStepIsValid, medlemskapStepIsValid, welcomingPageIsValid } from '../stepValidations';

jest.mock('./../fieldValidations', () => {
    return {
        validateNavn: jest.fn(() => undefined),
        validateFødselsnummer: jest.fn(() => undefined),
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

    describe('arbeidssituasjonStepIsValid', () => {
        describe('user is not frilanser', () => {
            it('should be valid if user is not frilanser', () => {
                expect(frilansIsValid({ frilans_erFrilanser: YesOrNo.NO })).toBeTruthy();
                expect(frilansIsValid({ frilans_erFrilanser: YesOrNo.YES })).toBeFalsy();
            });
        });
        describe('user is frilanser', () => {
            const formData: FrilansFormData = {
                frilans_erFrilanser: YesOrNo.YES,
                frilans_startdato: '2020-10-10',
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
                frilans_sluttdato: '2020-10-11',
            };
            it(`should be invalid if ${SøknadFormField.frilans_startdato} is missing`, () => {
                expect(frilansIsValid({ ...formData, frilans_startdato: undefined })).toBeFalsy();
            });
            it(`should be invalid if ${SøknadFormField.frilans_jobberFortsattSomFrilans} is missing`, () => {
                expect(frilansIsValid({ ...formData, frilans_jobberFortsattSomFrilans: undefined })).toBeFalsy();
            });
            it(`should be invalid if ${SøknadFormField.frilans_jobberFortsattSomFrilans} is false and ${SøknadFormField.frilans_sluttdato} missing`, () => {
                expect(
                    frilansIsValid({
                        ...formData,
                        frilans_jobberFortsattSomFrilans: YesOrNo.NO,
                        frilans_sluttdato: undefined,
                    })
                ).toBeFalsy();
            });
            it(`should be valid if ${SøknadFormField.frilans_jobberFortsattSomFrilans} === ${YesOrNo.YES} and ${SøknadFormField.frilans_sluttdato} is undefined`, () => {
                expect(frilansIsValid({ ...formData, frilans_sluttdato: undefined })).toBeTruthy();
            });
            it(`should be valid if ${SøknadFormField.frilans_jobberFortsattSomFrilans} === ${YesOrNo.NO} and ${SøknadFormField.frilans_sluttdato} is defined`, () => {
                expect(frilansIsValid({ ...formData, frilans_jobberFortsattSomFrilans: YesOrNo.NO })).toBeTruthy();
            });
        });
        describe('user is selvstendig næringsdrivende', () => {
            it(`should be valid if ${SøknadFormField.selvstendig_erSelvstendigNæringsdrivende} === ${YesOrNo.NO}`, () => {
                expect(
                    selvstendigIsValid({
                        selvstendig_erSelvstendigNæringsdrivende: YesOrNo.NO,
                    })
                ).toBeTruthy();
            });
            it(`should be valid if ${SøknadFormField.selvstendig_erSelvstendigNæringsdrivende} === ${YesOrNo.YES} and ${SøknadFormField.selvstendig_virksomheter} has more than one instance`, () => {
                const mockSelvstendigNæringsdrivende: any = {};
                expect(
                    selvstendigIsValid({
                        selvstendig_erSelvstendigNæringsdrivende: YesOrNo.YES,
                        selvstendig_virksomheter: [mockSelvstendigNæringsdrivende],
                    })
                ).toBeTruthy();
            });
            it(`should be invalid if ${SøknadFormField.selvstendig_erSelvstendigNæringsdrivende} === ${YesOrNo.YES} and ${SøknadFormField.selvstendig_virksomheter} is undefined or empty`, () => {
                expect(
                    selvstendigIsValid({
                        selvstendig_erSelvstendigNæringsdrivende: YesOrNo.YES,
                        selvstendig_virksomheter: undefined,
                    })
                ).toBeFalsy();
                expect(
                    selvstendigIsValid({
                        selvstendig_erSelvstendigNæringsdrivende: YesOrNo.YES,
                        selvstendig_virksomheter: [],
                    })
                ).toBeFalsy();
            });
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
