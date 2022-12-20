import { DateRange } from '@navikt/sif-common-formik/lib';
import fraværStepUtils from '../søknad/fravær-step/fraværStepUtils';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';

dayjs.extend(isSameOrBefore);

export const sortByDate = (d1: Date, d2: Date): number => (dayjs(d1).isAfter(d2, 'day') ? 1 : -1);

export const getDatesWithinDateRange = ({ from, to }: DateRange): Date[] => {
    const dates: Date[] = [];
    let currentDate: Date = from;
    if (dayjs(from).isAfter(to)) {
        throw new Error('From date cannot be after to date');
    }
    while (dayjs(currentDate).isSameOrBefore(to)) {
        dates.push(currentDate);
        currentDate = dayjs(currentDate).add(1, 'day').toDate();
    }
    return dates;
};

export const skalEndringeneFor2023Brukes = (fraværDager: FraværDag[], fraværPerioder: FraværPeriode[]) =>
    dayjs().year() === 2022 && fraværStepUtils.getÅrstallFromFravær(fraværDager, fraværPerioder) === 2023; //TODO endre til 2023 etter tester
