import { DateRange, sortDateRange } from 'common/utils/dateUtils';
import { FraværDelerAvDag, Periode } from '../../../@types/omsorgspengerutbetaling-schema';
import moment from 'moment';

export const enum Weekday {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday'
}

export const getWeekdayName = (date: Date): Weekday | undefined => {
    switch (date.getDay()) {
        case 0:
            return Weekday.sunday;
        case 1:
            return Weekday.monday;
        case 2:
            return Weekday.tuesday;
        case 3:
            return Weekday.wednesday;
        case 4:
            return Weekday.thursday;
        case 5:
            return Weekday.friday;
        case 6:
            return Weekday.saturday;
        default:
            return undefined;
    }
};

export enum DrivingResult {
    hasntStarted = 'hasntStarted',
    stillDriving = 'stillDriving',
    zeroDateRanges = 'zeroDateRanges',
    hasWeekdayJumps = 'hasWeekdayJumps',
    noWeekdayJumps = 'noWeekdayJumps'
}

export interface DrivingThroughTownStatus {
    currentDateRange?: DateRange;
    lanesInThePast: DateRange[];
    remainingLanes: DateRange[];
    result: DrivingResult;
}

export const fraværDelerAvDagToPeriode = (fraværDelerAvDag: FraværDelerAvDag): Periode => ({
    tom: fraværDelerAvDag.dato,
    fom: fraværDelerAvDag.dato
});

export const periodeToDateRange = (periode: Periode): DateRange => ({
    from: periode.fom,
    to: periode.tom
});

export const getFirstDateRange = (dateRanges: DateRange[]): [DateRange | undefined, DateRange[]] => {
    const sortedDateRangeList = dateRanges.slice().sort(sortDateRange);
    const first: DateRange | undefined = sortedDateRangeList
        .slice()
        .reverse()
        .pop();
    const remaining = sortedDateRangeList.slice(1);
    return [first, remaining];
};

export const dateInDateRange = (date: Date, dateRange: DateRange): boolean =>
    (moment(date).isSame(dateRange.from) || moment(date).isAfter(dateRange.from)) &&
    (moment(date).isSame(dateRange.to) || moment(date).isBefore(dateRange.to));

export const isSaturday = (date: Date): boolean => {
    return getWeekdayName(date) === Weekday.saturday;
};

export const isSunday = (date: Date): boolean => {
    return getWeekdayName(date) === Weekday.saturday;
};

export const jumpOneDay = (date: Date): Date => new Date(date.getDate() + 1);
export const jumpTwoDays = (date: Date): Date => jumpOneDay(jumpOneDay(date));

export const changeLane = (
    currentDateRange: DateRange | undefined,
    remainingLanes: DateRange[]
): [DateRange | undefined, DateRange[]] => {
    if (currentDateRange === undefined) {
        return [undefined, remainingLanes];
    }
    const maybeNextLaneIndex: number = remainingLanes.findIndex((lane: DateRange) =>
        dateInDateRange(currentDateRange.to, lane)
    );
    if (maybeNextLaneIndex == -1) {
        // Fant ingen passende lane å bytte til, men må sjekke etter lørdag og søndag.
        if (isSaturday(currentDateRange.to)) {
            changeLane({ ...currentDateRange, to: jumpTwoDays(currentDateRange.to) }, remainingLanes);
        }
        if (isSunday(currentDateRange.to)) {
            changeLane({ ...currentDateRange, to: jumpOneDay(currentDateRange.to) }, remainingLanes);
        }
        return [undefined, remainingLanes];
    } else {
        return [
            remainingLanes[maybeNextLaneIndex],
            remainingLanes.filter((lane, index) => {
                return index === maybeNextLaneIndex;
            })
        ];
    }
};

export const digThroughTime = (drivingThroughTownStatus: DrivingThroughTownStatus): DrivingThroughTownStatus => {
    const { currentDateRange, remainingLanes, lanesInThePast, result } = drivingThroughTownStatus;

    if (result === DrivingResult.hasntStarted) {
        if (remainingLanes.length > 0) {
            const [first, remaining]: [DateRange | undefined, DateRange[]] = getFirstDateRange(remainingLanes);
            return digThroughTime({
                currentDateRange: first,
                remainingLanes: remaining,
                lanesInThePast: [],
                result: DrivingResult.stillDriving
            });
        } else {
            return {
                ...drivingThroughTownStatus,
                result: DrivingResult.zeroDateRanges
            };
        }
    } else {
        if (remainingLanes.length > 0) {
            const [nextLane, remainingLanesUpdated] = changeLane(currentDateRange, remainingLanes);

            if (currentDateRange && nextLane) {
                return remainingLanesUpdated.length > 0
                    ? digThroughTime({
                          currentDateRange: nextLane,
                          remainingLanes: remainingLanesUpdated,
                          lanesInThePast: [...lanesInThePast, currentDateRange],
                          result: DrivingResult.stillDriving
                      })
                    : {
                          currentDateRange: nextLane,
                          remainingLanes: remainingLanesUpdated,
                          lanesInThePast: [...lanesInThePast, currentDateRange],
                          result: DrivingResult.noWeekdayJumps
                      };
            } else {
                return {
                    ...drivingThroughTownStatus,
                    result: DrivingResult.hasWeekdayJumps
                };
            }
        } else {
            return {
                ...drivingThroughTownStatus,
                result: DrivingResult.noWeekdayJumps
            };
        }
    }
};

export const harPerioderMedHopp = (perioderMedFravær: Periode[], dagerMedDelvisFravær: FraværDelerAvDag[]) => {
    const ranges: DateRange[] = [...perioderMedFravær, ...dagerMedDelvisFravær.map(fraværDelerAvDagToPeriode)].map(
        periodeToDateRange
    );

    return digThroughTime({
        currentDateRange: undefined,
        remainingLanes: ranges,
        lanesInThePast: [],
        result: DrivingResult.hasntStarted
    });
};
