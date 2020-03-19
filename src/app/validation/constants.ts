import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { date3MonthsAgo } from '../utils/dates';

export const MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG = 7.5;

export const GYLDIG_TIDSROM = {
    fom: date3MonthsAgo,
    tom: dateToday
};
