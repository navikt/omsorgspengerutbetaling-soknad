import moment from 'moment';
import { Attachment } from 'common/types/Attachment';
import { FraværDelerAvDag } from '../../../@types/omsorgspengerutbetaling-schema';
import {
    AppFieldValidationErrors, fieldValidationError, harLikeDager, hasValue, validateFødselsnummer,
    validateLegeerklæring, validateNavn
} from '../fieldValidations';
import * as fødselsnummerValidator from '../fødselsnummerValidator';

import Mock = jest.Mock;
jest.mock('../fødselsnummerValidator', () => {
    return {
        fødselsnummerIsValid: jest.fn(),
        FødselsnummerValidationErrorReason: {
            MustConsistOf11Digits: 'MustConsistOf11Digits'
        }
    };
});

jest.mock('common/utils/dateUtils', () => {
    return {
        isMoreThan3YearsAgo: jest.fn()
    };
});

describe('fieldValidations', () => {
    const fieldRequiredError = fieldValidationError(AppFieldValidationErrors.påkrevd);

    describe('hasValue', () => {
        it('should return true if provided value is not undefined, null or empty string', () => {
            expect(hasValue('someValue')).toBe(true);
            expect(hasValue(1234)).toBe(true);
            expect(hasValue([])).toBe(true);
            expect(hasValue({})).toBe(true);
            expect(hasValue(true)).toBe(true);
            expect(hasValue(false)).toBe(true);
        });

        it('should return false if the provided value is undefined, null or empty string', () => {
            expect(hasValue('')).toBe(false);
            expect(hasValue(null)).toBe(false);
            expect(hasValue(undefined)).toBe(false);
        });
    });

    describe('validateFødselsnummer', () => {
        const mockedFnr = '1'.repeat(11);

        it('should return an error message specific for fødselsnummer not being 11 digits when reason for validation failure is MustConsistOf11Digits', () => {
            (fødselsnummerValidator.fødselsnummerIsValid as Mock).mockReturnValue([
                false,
                fødselsnummerValidator.FødselsnummerValidationErrorReason.MustConsistOf11Digits
            ]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerValidator.fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toEqual(fieldValidationError(AppFieldValidationErrors.fødselsnummer_11siffer));
        });

        it('should return an error message saying fnr format is validation has failed, but reason is not MustConsistOf11Digits', () => {
            (fødselsnummerValidator.fødselsnummerIsValid as Mock).mockReturnValue([false, []]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerValidator.fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toEqual(fieldValidationError(AppFieldValidationErrors.fødselsnummer_ugyldig));
        });

        it('should return undefined if fødselsnummer is valid', () => {
            (fødselsnummerValidator.fødselsnummerIsValid as Mock).mockReturnValue([true]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerValidator.fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toBeUndefined();
        });
    });

    describe('validateNavn', () => {
        it('should return an error message saying field is required if provided value is empty string and isRequired is set to true', () => {
            expect(validateNavn('', true)).toEqual(fieldRequiredError);
        });

        it('should return an error message saying field has to be 50 letters or less, if length is longer than 50 letters', () => {
            expect(validateNavn('a'.repeat(51))).toEqual(
                fieldValidationError(AppFieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters: 50 })
            );
        });

        it('should return undefined if value is valid (length > 0 && length <= 50)', () => {
            expect(validateNavn('a'.repeat(50))).toBeUndefined();
        });

        it('should return undefined if value is empty string when isRequired set to false', () => {
            expect(validateNavn('', false)).toBeUndefined();
        });
    });

    describe('validateLegeerklæring', () => {
        const fileMock = new File([''], 'filename.png', { type: 'text/png' });

        const uploadedAttachment: Attachment = { file: fileMock, pending: false, uploaded: true };
        const failedAttachment1: Attachment = { file: fileMock, pending: true, uploaded: false };
        const failedAttachment2: Attachment = { file: fileMock, pending: false, uploaded: false };

        it('should return error message saying that files must be uploaded if list is empty', () => {
            expect(validateLegeerklæring([])).toEqual(
                fieldValidationError(AppFieldValidationErrors.legeerklæring_mangler)
            );
        });

        it('should return error message saying that files must be uploaded if list contains no successfully uploaded attachments', () => {
            expect(validateLegeerklæring([failedAttachment1, failedAttachment2])).toEqual(
                fieldValidationError(AppFieldValidationErrors.legeerklæring_mangler)
            );
        });

        it('should return undefined if list contains between 1-3 successfully uploaded attachments', () => {
            expect(validateLegeerklæring([uploadedAttachment])).toBeUndefined();
            expect(validateLegeerklæring([uploadedAttachment, uploadedAttachment])).toBeUndefined();
            expect(validateLegeerklæring([uploadedAttachment, uploadedAttachment, uploadedAttachment])).toBeUndefined();
        });

        it('should return error message saying no more than 3 files if list contains 4 files or more', () => {
            expect(
                validateLegeerklæring([uploadedAttachment, uploadedAttachment, uploadedAttachment, uploadedAttachment])
            ).toEqual(fieldValidationError(AppFieldValidationErrors.legeerklæring_forMangeFiler));
        });
    });

    describe('harLikeDager', () => {
        const dag1: FraværDelerAvDag = { dato: new Date(), timer: 2 };
        const dag2: FraværDelerAvDag = {
            dato: moment()
                .add(1, 'day')
                .toDate(),
            timer: 2
        };
        it('should return false when only one item in array', () => {
            expect(harLikeDager([])).toBeFalsy();
            expect(harLikeDager([dag1])).toBeFalsy();
        });
        it('should return false when only unique dates in array', () => {
            expect(harLikeDager([dag1, dag2])).toBeFalsy();
        });
        it('should return true when there are two or more equal dates', () => {
            expect(harLikeDager([dag1, dag2, dag1])).toBeTruthy();
        });
    });
});
