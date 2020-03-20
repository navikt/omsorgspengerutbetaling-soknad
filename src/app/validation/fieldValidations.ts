import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import moment from 'moment';
import { Attachment } from 'common/types/Attachment';
import { attachmentHasBeenUploaded } from 'common/utils/attachmentUtils';
import {
    date1YearAgo, date1YearFromNow, DateRange, dateRangesCollide, dateRangesExceedsRange, dateToday
} from 'common/utils/dateUtils';
import { createFieldValidationError } from 'common/validation/fieldValidations';
import { FieldValidationResult } from 'common/validation/types';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import {
    GYLDIG_TIDSROM, MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG, MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG
} from './constants';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';

export enum AppFieldValidationErrors {
    'fødselsdato_ugyldig' = 'fieldvalidation.fødelsdato.ugyldig',
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fødselsnummer_11siffer' = 'fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'fieldvalidation.fødselsnummer.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler',
    'samværsavtale_mangler' = 'fieldvalidation.samværsavtale.mangler',
    'samværsavtale_forMangeFiler' = 'fieldvalidation.samværsavtale.forMangeFiler',
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
    'periode_ikke_registrert' = 'fieldvalidation.periode_ikke_registrert',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom'
}

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

const fieldIsRequiredError = () => fieldValidationError(AppFieldValidationErrors.påkrevd);

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | AppFieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
};

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError(AppFieldValidationErrors.fødselsnummer_11siffer);
        } else {
            return fieldValidationError(AppFieldValidationErrors.fødselsnummer_ugyldig);
        }
    }
};

export const validateNavn = (v: string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired === true && !hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 50;
    const nameIsValid = v.length <= maxNumOfLetters;

    return nameIsValid
        ? undefined
        : fieldValidationError(AppFieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
};

export const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }

    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.legeerklæring_mangler);
    }
    if (uploadedAttachments.length > 3) {
        return fieldValidationError(AppFieldValidationErrors.legeerklæring_forMangeFiler);
    }
    return undefined;
};

export const validateRequiredField = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const fieldValidationError = (
    key: AppFieldValidationErrors | undefined,
    values?: any
): FieldValidationResult => {
    return key
        ? {
              key,
              values
          }
        : undefined;
};

export const validateFødselsdato = (date: Date): FieldValidationResult => {
    if (!hasValue(date)) {
        return fieldIsRequiredError();
    }
    if (moment(date).isAfter(dateToday)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fødselsdato_ugyldig);
    }
    return undefined;
};

const isPeriodeMedFomTom = (periode: Periode): boolean => {
    return periode.fom !== undefined && periode.tom !== undefined;
};
export const validatePerioderMedFravær = (allePerioder: Periode[]): FieldValidationResult => {
    const perioder = allePerioder.filter(isPeriodeMedFomTom);
    if (perioder.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.fraværsperioder_mangler);
    }
    const dateRanges: DateRange[] = perioder.map((periode: Periode) => ({ from: periode.fom, to: periode.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(AppFieldValidationErrors.fraværsperioder_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: GYLDIG_TIDSROM.from, to: GYLDIG_TIDSROM.to })) {
        return fieldValidationError(AppFieldValidationErrors.fraværsperioder_utenfor_periode);
    }
    return undefined;
};

export const harLikeDager = (dager: FraværDelerAvDag[]): boolean => {
    return dager.some((dag, dagIdx) => {
        return dager.some((d, dIdx) => dIdx !== dagIdx && moment(d.dato).isSame(dag.dato, 'day'));
    });
};

const datoErInnenforTidsrom = (dato: Date, range: DateRange): boolean => {
    return moment(dato).isBetween(range.from, range.to, 'days', '[]');
};

export const validateDagerMedFravær = (alleDager: FraværDelerAvDag[]): FieldValidationResult => {
    const dager = alleDager.filter((d) => d.dato !== undefined && d.timer !== undefined && isNaN(d.timer) === false);

    if (dager.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.dager_med_fravær_mangler);
    }
    if (harLikeDager(dager)) {
        return fieldValidationError(AppFieldValidationErrors.dager_med_fravær_like);
    }
    return undefined;
};

export const validateDateInRange = (tidsrom: DateRange, isRequired?: boolean) => (date: any): FieldValidationResult => {
    if (isRequired && !hasValue(date)) {
        return fieldIsRequiredError();
    }
    if (!datoErInnenforTidsrom(date, tidsrom)) {
        return fieldValidationError(AppFieldValidationErrors.dato_utenfor_gyldig_tidsrom);
    }
    return undefined;
};

export const validateDelvisFraværTimer = (timer: any): FieldValidationResult => {
    if (!hasValue(timer)) {
        return fieldIsRequiredError();
    }
    const num = parseFloat(timer);
    if (isNaN(num)) {
        return fieldValidationError(AppFieldValidationErrors.timer_ikke_tall);
    }
    if (num < MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG || num > MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG) {
        return fieldValidationError(AppFieldValidationErrors.timer_for_mange_timer);
    }
    return undefined;
};
