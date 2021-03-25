import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FraværDag, FraværPeriode, FraværÅrsak } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';
import { getPeriodeBoundaries, harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../periodeUtils';

describe('getPeriodeBoundaries', () => {
    it('should return undefineds when empty arrays', () => {
        expect(getPeriodeBoundaries([], [])).toEqual({ min: undefined, max: undefined });
    });
    describe('should return boundaries when', () => {
        const date1 = dayjs().add(1, 'day').toDate();
        const date2 = dayjs().add(2, 'day').toDate();
        const date3 = dayjs().add(3, 'day').toDate();
        const date4 = dayjs().add(4, 'day').toDate();

        const periode1: FraværPeriode = {
            fraOgMed: date1,
            tilOgMed: date2,
            årsak: FraværÅrsak.ordinært,
        };
        const periode2: FraværPeriode = {
            fraOgMed: date3,
            tilOgMed: date4,
            årsak: FraværÅrsak.ordinært,
        };
        const dag1: FraværDag = {
            dato: date1,
            timerArbeidsdag: '2',
            timerFravær: '1',
            årsak: FraværÅrsak.ordinært,
        };
        const dag2: FraværDag = {
            dato: date2,
            timerArbeidsdag: '2',
            timerFravær: '1',
            årsak: FraværÅrsak.ordinært,
        };
        const dag3: FraværDag = {
            dato: date3,
            timerArbeidsdag: '2',
            timerFravær: '1',
            årsak: FraværÅrsak.ordinært,
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

    describe('fravær', () => {
        const perioderPgaSmittevernhensyn: FraværPeriode = {
            fraOgMed: apiStringDateToDate('2020-10-10'),
            tilOgMed: apiStringDateToDate('2020-10-11'),
            årsak: FraværÅrsak.smittevernhensyn,
        };
        const dagPgaSmittevernhensyn: FraværDag = {
            dato: apiStringDateToDate('2020-10-10'),
            årsak: FraværÅrsak.smittevernhensyn,
            timerArbeidsdag: '2',
            timerFravær: '1',
        };
        const perioderPgaStengBhgSkole: FraværPeriode = {
            fraOgMed: apiStringDateToDate('2020-10-10'),
            tilOgMed: apiStringDateToDate('2020-10-11'),
            årsak: FraværÅrsak.stengtSkoleBhg,
        };
        const dagPgaStengBhgSkole: FraværDag = {
            dato: apiStringDateToDate('2020-10-10'),
            årsak: FraværÅrsak.stengtSkoleBhg,
            timerArbeidsdag: '2',
            timerFravær: '1',
        };
        describe('harFraværPgaSmittevernhensyn', () => {
            it('returns false when no fravær', () => {
                expect(harFraværPgaSmittevernhensyn([], [])).toBeFalsy();
            });
            it(`returns false when only fraværårsak === ${FraværÅrsak.stengtSkoleBhg}`, () => {
                expect(harFraværPgaSmittevernhensyn([perioderPgaStengBhgSkole], [])).toBeFalsy();
                expect(harFraværPgaSmittevernhensyn([], [dagPgaStengBhgSkole])).toBeFalsy();
            });
            it(`returns true when periode fraværÅrsak === ${FraværÅrsak.smittevernhensyn} exists`, () => {
                expect(harFraværPgaSmittevernhensyn([perioderPgaSmittevernhensyn], [])).toBeTruthy();
                expect(harFraværPgaSmittevernhensyn([], [dagPgaSmittevernhensyn])).toBeTruthy();
            });
        });
        describe('harFraværPgaStengBhgSkole', () => {
            it('returns false when no fravær', () => {
                expect(harFraværPgaStengBhgSkole([], [])).toBeFalsy();
            });
            it(`returns false when only fraværårsak === ${FraværÅrsak.smittevernhensyn}`, () => {
                expect(harFraværPgaStengBhgSkole([perioderPgaSmittevernhensyn], [])).toBeFalsy();
                expect(harFraværPgaStengBhgSkole([], [dagPgaSmittevernhensyn])).toBeFalsy();
            });
            it(`returns true when periode fraværÅrsak === ${FraværÅrsak.stengtSkoleBhg} exists`, () => {
                expect(harFraværPgaStengBhgSkole([perioderPgaStengBhgSkole], [])).toBeTruthy();
                expect(harFraværPgaStengBhgSkole([], [dagPgaStengBhgSkole])).toBeTruthy();
            });
        });
    });
});
