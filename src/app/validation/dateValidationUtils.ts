import dayjs from 'dayjs';

export const datesCollide = (dates: Date[]): boolean => {
    return dates.some((outerDate, outerDateIdx) => {
        return dates.some(
            (innerDate, innerDateIdx) => innerDateIdx !== outerDateIdx && dayjs(innerDate).isSame(outerDate, 'day')
        );
    });
};
