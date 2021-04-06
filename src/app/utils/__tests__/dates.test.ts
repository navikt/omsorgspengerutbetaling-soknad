import { DateRange, dateToISOString } from '@navikt/sif-common-formik/lib';
import { getDatesWithinDateRange } from '../dates';

describe('getDatesWithinDateRange', () => {
    const range1Day: DateRange = { from: new Date(2020, 9, 10), to: new Date(2020, 9, 10) };
    const range3Days: DateRange = { from: new Date(2020, 9, 10), to: new Date(2020, 9, 12) };
    const range10Days: DateRange = { from: new Date(2020, 9, 10), to: new Date(2020, 9, 19) };

    it('returns correct dates within range containing 1 day', () => {
        const dates = getDatesWithinDateRange(range1Day);
        expect(dates.length).toBe(1);
    });

    it('returns correct dates within range containing 3 days', () => {
        const dates = getDatesWithinDateRange(range3Days);
        expect(dates.length).toBe(3);
        expect(dateToISOString(dates[0])).toEqual('2020-10-10');
        expect(dateToISOString(dates[1])).toEqual('2020-10-11');
        expect(dateToISOString(dates[2])).toEqual('2020-10-12');
    });

    it('returns correct dates within range containing 10 days', () => {
        const dates = getDatesWithinDateRange(range10Days);
        expect(dates.length).toBe(10);
    });
});
