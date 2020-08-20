import moment from 'moment';
import { FraværDelerAvDag } from '../../../@types/omsorgspengerutbetaling-schema';
import { harLikeDager } from '../fieldValidations';

jest.mock('common/utils/dateUtils', () => {
    return {
        isMoreThan3YearsAgo: jest.fn(),
    };
});

describe('fieldValidations', () => {
    describe('harLikeDager', () => {
        const dag1: FraværDelerAvDag = { dato: new Date(), timer: 2 };
        const dag2: FraværDelerAvDag = {
            dato: moment().add(1, 'day').toDate(),
            timer: 2,
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
