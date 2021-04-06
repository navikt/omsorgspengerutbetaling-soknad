import dayjs, { Dayjs } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { AppFieldValidationErrors } from '../validation/fieldValidations';
import { FraværDag, FraværPeriode, FraværÅrsak } from '@navikt/sif-common-forms/lib';

dayjs.extend(minMax);

export const isSameDay = (d1: Date, d2: Date): boolean => dayjs(d1).isSame(d2, 'day');

export const getPeriodeBoundaries = (
    perioderMedFravær: FraværPeriode[],
    dagerMedFravær: FraværDag[]
): { min?: Date; max?: Date } => {
    let min: Dayjs | undefined;
    let max: Dayjs | undefined;

    perioderMedFravær.forEach((p) => {
        min = min ? dayjs.min(dayjs(p.fraOgMed), min) : dayjs(p.fraOgMed);
        max = max ? dayjs.max(dayjs(p.tilOgMed), max) : dayjs(p.tilOgMed);
    });

    dagerMedFravær.forEach((d) => {
        min = min ? dayjs.min(dayjs(d.dato), min) : dayjs(d.dato);
        max = max ? dayjs.max(dayjs(d.dato), max) : dayjs(d.dato);
    });

    return {
        min: min !== undefined ? min.toDate() : undefined,
        max: max !== undefined ? max.toDate() : undefined,
    };
};

export const erHelg = (date: Date): boolean => {
    const dayName = date.getDay();
    return dayName === 0 || dayName === 6;
};

export const validatePeriodeNotWeekend = (date: Date): FieldValidationResult =>
    erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_periode) : undefined;

export const validateFraværDelerAvDagNotWeekend = (date: Date): FieldValidationResult =>
    erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_dag) : undefined;

export const harFraværPgaSmittevernhensyn = (perioder: FraværPeriode[], dager: FraværDag[]): boolean => {
    return [...perioder, ...dager].findIndex(({ årsak }) => årsak === FraværÅrsak.smittevernhensyn) >= 0;
};

export const harFraværPgaStengBhgSkole = (perioder: FraværPeriode[], dager: FraværDag[]): boolean => {
    return [...perioder, ...dager].findIndex(({ årsak }) => årsak === FraværÅrsak.stengtSkoleBhg) >= 0;
};
