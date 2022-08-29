import dayjs from 'dayjs';
import { dateToday } from '@navikt/sif-common-utils';

export const nYearsAgo = (years: number): Date => {
    return dayjs(dateToday).subtract(years, 'y').startOf('year').toDate();
};
