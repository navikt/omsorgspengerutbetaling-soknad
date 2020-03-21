import moment from 'moment';

export const dateCollideWithOtherDates = (date: Date, otherDates: Date[]): boolean => {
    return otherDates.some((d) => moment(date).isSame(d, 'day'));
};

export const datesCollide = (dates: Date[]): boolean => {
    return dates.some((outerDate, outerDateIdx) => {
        return dates.some(
            (innerDate, innerDateIdx) => innerDateIdx !== outerDateIdx && moment(innerDate).isSame(outerDate, 'day')
        );
    });
};
