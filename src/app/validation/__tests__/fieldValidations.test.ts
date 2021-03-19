import { FraværDag, FraværÅrsak } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';
import { harLikeDager } from '../fieldValidations';

jest.mock('common/utils/dateUtils', () => {
    return {
        isMoreThan3YearsAgo: jest.fn(),
    };
});

describe('fieldValidations', () => {
    describe('harLikeDager', () => {
        const dag1: FraværDag = { dato: new Date(), årsak: FraværÅrsak.annet, timerFravær: '1', timerArbeidsdag: '1' };
        const dag2: FraværDag = {
            dato: dayjs().add(1, 'day').toDate(),
            årsak: FraværÅrsak.annet,
            timerFravær: '1',
            timerArbeidsdag: '1',
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
