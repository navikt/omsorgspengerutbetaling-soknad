import dayjs, { Dayjs } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { AppFieldValidationErrors } from '../validation/fieldValidations';

dayjs.extend(minMax);

export const getPeriodeBoundaries = (
    perioderMedFravær: Periode[],
    dagerMedFravær: FraværDelerAvDag[]
): { min?: Date; max?: Date } => {
    let min: Dayjs | undefined;
    let max: Dayjs | undefined;

    perioderMedFravær.forEach((p) => {
        min = min ? dayjs.min(dayjs(p.fom), min) : dayjs(p.fom);
        max = max ? dayjs.max(dayjs(p.tom), max) : dayjs(p.tom);
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
