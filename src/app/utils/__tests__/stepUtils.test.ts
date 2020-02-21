import { YesOrNo } from 'common/types/YesOrNo';
import { initialValues, SøkersRelasjonTilBarnet } from '../../types/OmsorgspengesøknadFormData';
import * as stepUtils from '../stepUtils';

jest.mock('./../../validation/stepValidations', () => {
    return {
        welcomingPageIsValid: jest.fn(() => true),
        opplysningerOmBarnetStepIsValid: jest.fn(() => true),
        arbeidStepIsValid: jest.fn(() => true),
        medlemskapStepIsValid: jest.fn(() => true),
        legeerklæringStepIsValid: jest.fn(() => true)
    };
});

describe('stepUtils', () => {
    it('should include avtalestep if deltOmsorg is YES', () => {
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: YesOrNo.NO })).toBeTruthy();
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: undefined })).toBeFalsy();
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: YesOrNo.YES })).toBeFalsy();
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: YesOrNo.DO_NOT_KNOW })).toBeFalsy();
    });

    describe('includeAvtaleStep', () => {
        describe('when registered barn is chosen', () => {
            const data = {
                ...initialValues,
                barnetSøknadenGjelder: 'id',
                søknadenGjelderEtAnnetBarn: undefined
            };
            it('should include avtalestep when NOT sammeAdresse', () => {
                expect(stepUtils.includeAvtaleStep({ ...data, sammeAdresse: YesOrNo.NO })).toBeTruthy();
            });
            it('should NOT include avtalestep when sammeAdresse', () => {
                expect(stepUtils.includeAvtaleStep({ ...data, sammeAdresse: YesOrNo.YES })).toBeFalsy();
            });
        });
        describe('when gjelderAnnetBarn is selected', () => {
            const data = {
                ...initialValues,
                barnetSøknadenGjelder: undefined,
                søknadenGjelderEtAnnetBarn: true
            };
            it('should include avtalestep when NOT sammeAdresse', () => {
                expect(stepUtils.includeAvtaleStep({ ...data, sammeAdresse: YesOrNo.NO })).toBeTruthy();
            });
            it('should NOT include avtalestep when NOT sammeAdresse and relasjon is Fosterforelder', () => {
                expect(
                    stepUtils.includeAvtaleStep({
                        ...data,
                        sammeAdresse: YesOrNo.NO,
                        søkersRelasjonTilBarnet: SøkersRelasjonTilBarnet.FOSTERFORELDER
                    })
                ).toBeFalsy();
            });
            it('should NOT include avtalestep when sammeAdresse', () => {
                expect(stepUtils.includeAvtaleStep({ ...data, sammeAdresse: YesOrNo.YES })).toBeFalsy();
            });
        });
    });
});
