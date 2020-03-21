import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import moment from 'moment';
import {
    date1YearAgo, date1YearFromNow, DateRange, dateRangesCollide, dateRangesExceedsRange
} from 'common/utils/dateUtils';
import { createFieldValidationError } from 'common/validation/fieldValidations';
import { FieldValidationResult } from 'common/validation/types';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { datesCollide } from './dateValidationUtils';

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

export type FieldValidationArray = (validations: FormikValidateFunction[]) => (value: any) => FieldValidationResult;

export enum AppFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fraværsperioder_mangler' = 'fieldvalidation.fraværsperioder_mangler',
    'fraværsperioder_overlapper' = 'fieldvalidation.fraværsperioder_overlapper',
    'fraværsperioder_utenfor_periode' = 'fieldvalidation.fraværsperioder_utenfor_periode',
    'dager_med_fravær_ugyldig_dag' = 'fieldvalidation.dager_med_fravær_ugyldig_dag',
    'dager_med_fravær_mangler' = 'fieldvalidation.dager_med_fravær_mangler',
    'dager_med_fravær_like' = 'fieldvalidation.dager_med_fravær_like',
    'dager_med_fravær_utenfor_periode' = 'fieldvalidation.dager_med_fravær_utenfor_periode',
    'dager_med_for_mange_timer' = 'fieldvalidation.dager_med_for_mange_timer',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom'
}

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | AppFieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
};

export const validateAll: FieldValidationArray = (validations: FormikValidateFunction[]) => (
    value: any
): FieldValidationResult => {
    let result: FieldValidationResult;
    validations.some((validate) => {
        const r = validate(value);
        if (r) {
            result = r;
            return true;
        }
        return false;
    });
    return result;
};

// -------------------------------------------------
// MedlemsskapStep
// -------------------------------------------------

export const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return createFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return createFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }

    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return createFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return createFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

// -------------------------------------------------
// PeriodeStep
// -------------------------------------------------

const datoErInnenforTidsrom = (dato: Date, range: Partial<DateRange>): boolean => {
    if (range.from && range.to) {
        return moment(dato).isBetween(range.from, range.to, 'days', '[]');
    }
    if (range.from) {
        return moment(dato).isSameOrAfter(range.from);
    }
    if (range.to) {
        return moment(dato).isSameOrBefore(range.to);
    }
    return false;
};

const isPeriodeMedFomTom = (periode: Periode): boolean => {
    return periode.fom !== undefined && periode.tom !== undefined;
};

export const harLikeDager = (dager: FraværDelerAvDag[]): boolean => {
    return datesCollide(dager.map((d) => d.dato));
};

export const validatePerioderMedFravær = (allePerioder: Periode[]): FieldValidationResult => {
    const perioder = allePerioder.filter(isPeriodeMedFomTom);
    if (perioder.length === 0) {
        return createFieldValidationError(AppFieldValidationErrors.fraværsperioder_mangler);
    }
    const dateRanges: DateRange[] = perioder.map((periode: Periode) => ({ from: periode.fom, to: periode.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createFieldValidationError(AppFieldValidationErrors.fraværsperioder_overlapper);
    }
    return undefined;
};

export const validateDagerMedFravær = (alleDager: FraværDelerAvDag[]): FieldValidationResult => {
    const dager = alleDager.filter((d) => d.dato !== undefined && d.timer !== undefined && isNaN(d.timer) === false);

    if (dager.length === 0) {
        return createFieldValidationError(AppFieldValidationErrors.dager_med_fravær_mangler);
    }
    if (harLikeDager(dager)) {
        return createFieldValidationError(AppFieldValidationErrors.dager_med_fravær_like);
    }
    return undefined;
};

export const validateDateInRange = (tidsrom: Partial<DateRange>) => (date: any): FieldValidationResult => {
    if (!datoErInnenforTidsrom(date, tidsrom)) {
        return createFieldValidationError(AppFieldValidationErrors.dato_utenfor_gyldig_tidsrom);
    }
    return undefined;
};

export const validateHours = ({ min, max }: { min?: number; max?: number }) => (value: any): FieldValidationResult => {
    const num = parseFloat(value);
    if (isNaN(num)) {
        return createFieldValidationError(AppFieldValidationErrors.timer_ikke_tall);
    }
    if ((min !== undefined && num < min) || (max !== undefined && value > max)) {
        return createFieldValidationError(AppFieldValidationErrors.timer_for_mange_timer);
    }
    return undefined;
};
