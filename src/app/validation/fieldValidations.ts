import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';

export enum AppFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fraværsperioder_mangler' = 'fieldvalidation.fraværsperioder_mangler',
    'fraværsperioder_overlapper' = 'fieldvalidation.fraværsperioder_overlapper',
    'fraværsperioder_utenfor_periode' = 'fieldvalidation.fraværsperioder_utenfor_periode',
    'fraværsperioder_overlapper_med_fraværsdager' = 'fieldvalidation.fraværsperioder_overlapper_med_fraværsdager',
    'dager_med_fravær_ugyldig_dag' = 'fieldvalidation.dager_med_fravær_ugyldig_dag',
    'dager_med_fravær_mangler' = 'fieldvalidation.dager_med_fravær_mangler',
    'dager_med_fravær_like' = 'fieldvalidation.dager_med_fravær_like',
    'dager_med_fravær_utenfor_periode' = 'fieldvalidation.dager_med_fravær_utenfor_periode',
    'dager_med_for_mange_timer' = 'fieldvalidation.dager_med_for_mange_timer',
    'dager_med_fravær_overlapper_perioder' = 'fieldvalidation.dager_med_fravær_overlapper_perioder',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom',
    'tom_er_før_fom' = 'fieldvalidation.tom_er_før_fom',
    'ingen_dokumenter' = 'fieldvalidation.ingen_dokumenter',
    'for_mange_dokumenter' = 'fieldvalidation.for_mange_dokumenter',
    'samlet_storrelse_for_hoy' = 'fieldvalidation.samlet_storrelse_for_hoy',
    'ingen_endringer_spesifisert' = 'fieldvalidation.inntektsendring.ingen_endringer_spesifisert',
    'ikke_lørdag_eller_søndag_periode' = 'fieldvalidation.saturday_and_sunday_not_possible_periode',
    'ikke_lørdag_eller_søndag_dag' = 'fieldvalidation.saturday_and_sunday_not_possible_dag',

    'fraværDagIkkeSammeÅrstall' = 'fieldvalidation.fraværDagIkkeSammeÅrstall',
    'fraværPeriodeIkkeSammeÅrstall' = 'fieldvalidation.fraværPeriodeIkkeSammeÅrstall',

    'frilans_startEtterDagensDato' = 'fieldvalidation.frilans_startEtterDagensDato',
    'frilans_startEtterSlutt' = 'fieldvalidation.frilans_startEtterSlutt',
}

export const validateDocuments = (attachments: Attachment[]): ValidationResult<string> => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(attachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return AppFieldValidationErrors.samlet_storrelse_for_hoy;
    }
    if (uploadedAttachments.length > 100) {
        return AppFieldValidationErrors.for_mange_dokumenter;
    }
    return undefined;
};

export const validateFraværDagerHarÅrstall = (dager: FraværDag[], årstall?: number): ValidationResult<string> => {
    if (årstall !== undefined) {
        return dager.find((d) => d.dato.getFullYear() !== årstall)
            ? AppFieldValidationErrors.fraværDagIkkeSammeÅrstall
            : undefined;
    }
    return undefined;
};

export const validateFraværPerioderHarÅrstall = (perioder: FraværPeriode[], årstall?: number): string | undefined => {
    if (årstall !== undefined) {
        return perioder.find((p) => p.fraOgMed.getFullYear() !== årstall || p.tilOgMed.getFullYear() !== årstall)
            ? AppFieldValidationErrors.fraværPeriodeIkkeSammeÅrstall
            : undefined;
    }
    return undefined;
};
