import dayjs from 'dayjs';

const beforeDate = '2021-01-01';

export const isCurrentDateBefore2021 = () => {
    return dayjs().isBefore(dayjs(beforeDate));
};
