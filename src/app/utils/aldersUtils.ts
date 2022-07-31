import dayjs from 'dayjs';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const nYearsAgo = (years: number): Date => {
    return dayjs(dateToday).subtract(years, 'y').startOf('year').toDate();
};
