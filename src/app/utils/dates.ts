import dayjs from 'dayjs';

export const date3MonthsAgo = dayjs().subtract(3, 'months').toDate();
