import moment from 'moment';
import { FraværDelerAvDag, Periode } from '../../../@types/omsorgspengerutbetaling-schema';
import { getPeriodeBoundaries } from '../periodeUtils';

describe('getPeriodeBoundaries', () => {
    it('should return undefineds when empty arrays', () => {
        expect(getPeriodeBoundaries([], [])).toEqual({ min: undefined, max: undefined });
    });
    describe('should return boundaries when', () => {
        const date1 = moment()
            .add(1, 'day')
            .toDate();
        const date2 = moment()
            .add(2, 'day')
            .toDate();
        const date3 = moment()
            .add(3, 'day')
            .toDate();
        const date4 = moment()
            .add(4, 'day')
            .toDate();

        const periode1: Periode = {
            fom: date1,
            tom: date2
        };
        const periode2: Periode = {
            fom: date3,
            tom: date4
        };
        const dag1: FraværDelerAvDag = {
            dato: date1,
            timer: 1
        };
        const dag2: FraværDelerAvDag = {
            dato: date2,
            timer: 1
        };
        const dag3: FraværDelerAvDag = {
            dato: date3,
            timer: 1
        };

        it('has only one periode', () => {
            expect(getPeriodeBoundaries([periode1], [])).toEqual({ min: date1, max: date2 });
        });
        it('has two periods', () => {
            expect(getPeriodeBoundaries([periode1, periode2], [])).toEqual({ min: date1, max: date4 });
        });
        it('has only single days', () => {
            expect(getPeriodeBoundaries([], [dag1])).toEqual({ min: date1, max: date1 });
        });
        it('has multiple days', () => {
            expect(getPeriodeBoundaries([], [dag1, dag2])).toEqual({ min: date1, max: date2 });
        });
        it('has periods and days days', () => {
            expect(getPeriodeBoundaries([periode1], [dag3])).toEqual({ min: date1, max: date3 });
        });
        it('has periods and days days and periods are in the beginning and days are at the end', () => {
            expect(getPeriodeBoundaries([periode1], [dag3])).toEqual({ min: date1, max: date3 });
        });
        it('has periods and days days and periods are in the end and days are in the beginning', () => {
            expect(getPeriodeBoundaries([periode2], [dag1])).toEqual({ min: date1, max: date4 });
        });
    });
});
