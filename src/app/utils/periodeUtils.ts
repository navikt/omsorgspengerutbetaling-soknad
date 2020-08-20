import moment, { Moment } from 'moment';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { FieldValidationResult } from 'common/validation/types';
import { createFieldValidationError } from 'common/validation/fieldValidations';
import { AppFieldValidationErrors } from '../validation/fieldValidations';

export const getPeriodeBoundaries = (
    perioderMedFravær: Periode[],
    dagerMedFravær: FraværDelerAvDag[]
): { min?: Date; max?: Date } => {
    let min: Moment | undefined;
    let max: Moment | undefined;

    perioderMedFravær.forEach((p) => {
        min = min ? moment.min(moment(p.fom), min) : moment(p.fom);
        max = max ? moment.max(moment(p.tom), max) : moment(p.tom);
    });

    dagerMedFravær.forEach((d) => {
        min = min ? moment.min(moment(d.dato), min) : moment(d.dato);
        max = max ? moment.max(moment(d.dato), max) : moment(d.dato);
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
