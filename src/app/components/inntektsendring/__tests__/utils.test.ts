import {
    changeLaneIfPossible,
    harPerioderMedHopp,
    isConnectingOrOverlappingDateRange,
    jumpOneDay
} from '../periodeUtils';
import { DateRange } from 'common/utils/dateUtils';
import {
    godBlandingDager,
    godBlandingPerioder,
    mangeConnectedPerioder,
    mangeConnectedPerioderMedHoppIEnHelg,
    mangePerioderMedEtHull, periode0501Fredag0505Tirsdag
} from '../mockdata/perioder';

describe('viser inntektsendring spørsmål når det er hopp i spesifiserte perioder', () => {

    it('is possible to have many connected as combination of perioder and dager', () => {
        expect(harPerioderMedHopp(godBlandingPerioder, godBlandingDager)).toBe(false);
    });

    it('crashes når det er hopp i perioder', () => {
        expect(harPerioderMedHopp(mangePerioderMedEtHull, [])).toBe(true);
    });

    it('does not crash når hoppet kun er en lørdag eller søndag', () => {
        expect(harPerioderMedHopp(mangeConnectedPerioderMedHoppIEnHelg, [])).toBe(false);
    });

    it('completes the ride når definerte perioder utgjør en lang sammenhengende periode', () => {
        expect(harPerioderMedHopp(mangeConnectedPerioder, [])).toBe(false);
    });

    it('gir false hvis periode liste er tom', () => {
        expect(harPerioderMedHopp([], [])).toBe(false);
    });

    it('gir true hvis periode liste har kun 1 periode', () => {
        expect(harPerioderMedHopp([periode0501Fredag0505Tirsdag], [])).toBe(false);
    });

    // it('still works med en skikkelig kompleks kombinasjon', () => {
    //     expect(harPerioderMedHopp([periode0501Fredag0505Tirsdag], [])).toBe(false);
    // });


    it('gives the next day', () => {
        const dateToday = new Date('2020-01-01');
        const dateTomorrow = new Date('2020-01-02');
        const shouldBeTomorrow = jumpOneDay(dateToday);
        expect(shouldBeTomorrow.getTime()).toBe(dateTomorrow.getTime());
    });

    it('is connecting or overlapping date range', () => {
        const date = new Date('2020-01-03');
        const dateRange: DateRange = {
            from: new Date('2020-01-01'),
            to: new Date('2020-01-05')
        };
        const shouldBeTrue: boolean = isConnectingOrOverlappingDateRange(date, dateRange);
        expect(shouldBeTrue).toBe(true);
    });

    it('is not connecting or overlapping date range', () => {
        const date = new Date('2020-01-10');
        const dateRange: DateRange = {
            from: new Date('2020-01-01'),
            to: new Date('2020-01-05')
        };
        const shouldBeFalse: boolean = isConnectingOrOverlappingDateRange(date, dateRange);
        expect(shouldBeFalse).toBe(false);
    });

    it('is connected', () => {
        const date = new Date('2020-01-01');
        const dateRange: DateRange = {
            from: new Date('2020-01-02'),
            to: new Date('2020-01-06')
        };
        const shouldBeTrue: boolean = isConnectingOrOverlappingDateRange(date, dateRange);
        expect(shouldBeTrue).toBe(true);
    });

    it('will succesfully change lane', () => {
        const currentLane: DateRange = {
            from: new Date('2020-05-04'),
            to: new Date('2020-05-07')
        };
        const nextLane: DateRange = {
            from: new Date('2020-05-08'),
            to: new Date('2020-05-09')
        };
        const remainingLanes: DateRange[] = [nextLane];
        const [nextLaneUpdated, remainingLanesUpdated]: [DateRange | undefined, DateRange[]] = changeLaneIfPossible(
            currentLane,
            remainingLanes
        );
        expect(JSON.stringify(nextLaneUpdated, null, 4)).toBe(
            JSON.stringify(
                {
                    from: new Date('2020-05-08'),
                    to: new Date('2020-05-09')
                },
                null,
                4
            )
        );
        expect(remainingLanesUpdated.length).toBe(0);
    });

    it('will succesfully change lane over the weekend', () => {
        const currentLane: DateRange = {
            from: new Date('2020-05-06'),
            to: new Date('2020-05-08')
        };
        const nextLane: DateRange = {
            from: new Date('2020-05-11'),
            to: new Date('2020-05-31')
        };
        const remainingLanes: DateRange[] = [nextLane];
        const [nextLaneUpdated, remainingLanesUpdated]: [DateRange | undefined, DateRange[]] = changeLaneIfPossible(
            currentLane,
            remainingLanes
        );
        expect(nextLaneUpdated).toBeDefined();
        expect(remainingLanesUpdated.length).toBe(0);
    });
});
