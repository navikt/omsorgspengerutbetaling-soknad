import dayjs from 'dayjs';

const beforeDate = '2021-01-01';

export const isDateBefore2021 = () => {
    return dayjs().isBefore(dayjs(beforeDate));
};
