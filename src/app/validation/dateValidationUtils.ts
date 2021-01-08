import dayjs from 'dayjs';

export const dateCollideWithOtherDates = (date: Date, otherDates: Date[]): boolean => {
    return otherDates.some((d) => dayjs(date).isSame(d, 'day'));
};

export const datesCollide = (dates: Date[]): boolean => {
    return dates.some((outerDate, outerDateIdx) => {
        return dates.some(
            (innerDate, innerDateIdx) => innerDateIdx !== outerDateIdx && dayjs(innerDate).isSame(outerDate, 'day')
        );
    });
};
