import moment, { Moment } from 'moment';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import {FieldValidationResult} from "common/validation/types";
import {createFieldValidationError} from "common/validation/fieldValidations";
import {AppFieldValidationErrors} from "../validation/fieldValidations";

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
        max: max !== undefined ? max.toDate() : undefined
    };
};

export enum Weekday {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday'
}

export const getWeekdayName = (date: Date): Weekday | undefined => {
    switch (date.getDay()) {
        case 0:
            return Weekday.sunday;
        case 1:
            return Weekday.monday;
        case 2:
            return Weekday.tuesday;
        case 3:
            return Weekday.wednesday;
        case 4:
            return Weekday.thursday;
        case 5:
            return Weekday.friday;
        case 6:
            return Weekday.saturday;
        default:
            return undefined;
    }
};

export const erHelg = (date: Date): boolean => {
    const dayName = getWeekdayName(date);
    return dayName === Weekday.saturday || dayName === Weekday.sunday;
};

export const validatePeriodeNotWeekend = (date: Date): FieldValidationResult =>
    erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_periode) : undefined;

export const validateFraværDelerAvDagNotWeekend = (date: Date): FieldValidationResult =>
    erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_dag) : undefined;

