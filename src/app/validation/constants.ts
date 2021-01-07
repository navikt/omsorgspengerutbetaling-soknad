import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';

export const MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG = 7.5;
export const MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG = 0.5;

export const GYLDIG_TIDSROM: Partial<DateRange> = {
    from: undefined,
    to: dayjs().endOf('day').toDate(),
};
