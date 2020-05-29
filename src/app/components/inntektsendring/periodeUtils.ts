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

export const isConnectingOrOverlappingDateRange = (date: Date, dateRange: DateRange): boolean => {
    const tomorrow = new Date(date.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
        (moment(tomorrow).isSame(dateRange.from) || moment(tomorrow).isAfter(dateRange.from)) &&
        (moment(date).isSame(dateRange.to) || moment(date).isBefore(dateRange.to))
    );
};

export const isFriday = (date: Date): boolean => {
    return getWeekdayName(date) === Weekday.friday;
};

export const isSaturday = (date: Date): boolean => {
    return getWeekdayName(date) === Weekday.saturday;
};

export const isSunday = (date: Date): boolean => {
    return getWeekdayName(date) === Weekday.sunday;
};

export const jumpOneDay = (date: Date): Date => {
    const tomorrow = new Date(date.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};

export const jumpTwoDays = (date: Date): Date => jumpOneDay(jumpOneDay(date));
export const jumpThreeDays = (date: Date): Date => jumpOneDay(jumpOneDay(jumpOneDay(date)));

export const changeLaneIfPossible = (
    currentLane: DateRange | undefined,
    remainingLanes: DateRange[]
): [DateRange | undefined, DateRange[]] => {
    if (currentLane === undefined) {
        return [undefined, remainingLanes];
    }
    const date = currentLane.to;
    const maybeNextLaneIndex: number = remainingLanes.findIndex((lane: DateRange) =>
        isConnectingOrOverlappingDateRange(date, lane)
    );
    if (maybeNextLaneIndex === -1) {
        // Fant ingen passende lane å bytte til, men må sjekke etter fredag, lørdag og søndag.
        if (isFriday(date)) {
            return changeLaneIfPossible({ ...currentLane, to: jumpThreeDays(date) }, remainingLanes);
        }
        if (isSaturday(date)) {
            return changeLaneIfPossible({ ...currentLane, to: jumpTwoDays(date) }, remainingLanes);
        }
        if (isSunday(date)) {
            return changeLaneIfPossible({ ...currentLane, to: jumpOneDay(date) }, remainingLanes);
        }
        return [undefined, remainingLanes];
    } else {
        return [
            remainingLanes[maybeNextLaneIndex],
            remainingLanes.filter((lane, index) => index !== maybeNextLaneIndex)
        ];
    }
};

export const nextLaneToDateIsTheLatestDate = (nextLane: DateRange, remainingLanesUpdated: DateRange[]): boolean =>
    remainingLanesUpdated.filter((lane: DateRange) => {
        return moment(nextLane.to).isBefore(lane.to);
    }).length === 0;

export const digThroughTime = (drivingThroughTownStatus: DrivingThroughTownStatus): DrivingThroughTownStatus => {
    // Beklager på forhånd hvis du har tenkt å lese denne pga dårlige navn.
    // Dette er en rekursiv funksjon som gjør følgende:
    // 1. Finner frem tidligste dato blant alle periodene
    // 2. Prøver å "kjøre" helt til siste dato
    // 3. Stopper å returnerer en status hvis den finner hull mellom perioder
    // 4. Hvis den kommer til enden (i.e. siste dato) så returnerer den "ingen hull funnet"
    // 5. Lørdager og søndager regnes ikke som hull
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
            const [nextLane, remainingLanesUpdated] = changeLaneIfPossible(currentDateRange, remainingLanes);

            if (nextLane && nextLaneToDateIsTheLatestDate(nextLane, remainingLanesUpdated)) {
                return {
                    currentDateRange: nextLane,
                    remainingLanes: remainingLanesUpdated,
                    lanesInThePast: currentDateRange ? [...lanesInThePast, currentDateRange] : lanesInThePast,
                    result: DrivingResult.noWeekdayJumps
                };
            }

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

export const harPerioderMedHopp = (perioderMedFravær: Periode[], dagerMedDelvisFravær: FraværDelerAvDag[]): boolean => {
    const ranges: DateRange[] = [...perioderMedFravær, ...dagerMedDelvisFravær.map(fraværDelerAvDagToPeriode)].map(
        periodeToDateRange
    );

    return (
        digThroughTime({
            currentDateRange: undefined,
            remainingLanes: ranges,
            lanesInThePast: [],
            result: DrivingResult.hasntStarted
        }).result === DrivingResult.hasWeekdayJumps
    );
};
