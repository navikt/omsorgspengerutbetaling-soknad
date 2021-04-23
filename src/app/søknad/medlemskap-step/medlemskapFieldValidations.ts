import {
    date1YearAgo,
    date1YearFromNow,
    dateRangesCollide,
    dateRangesExceedsRange,
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getYesOrNoValidator, ValidateYesOrNoError } from '@navikt/sif-common-formik/lib/validation';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { SøknadFormField } from '../../types/SøknadFormData';

export const MedlemskapFieldErrors = {
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'validation.harBoddUtenforNorgeSiste12Mnd.yesOrNoIsUnanswered',
    },
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: {
        utenlandsopphold_ikke_registrert: 'validation.utenlandsoppholdSiste12Mnd.utenlandsopphold_ikke_registrert',
        utenlandsopphold_overlapper: 'validation.utenlandsoppholdSiste12Mnd.utenlandsopphold_overlapper',
        utenlandsopphold_utenfor_periode: 'validation.utenlandsoppholdSiste12Mnd.utenlandsopphold_utenfor_periode',
    },
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'validation.skalBoUtenforNorgeNeste12Mnd.yesOrNoIsUnanswered',
    },
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: {
        utenlandsopphold_ikke_registrert: 'validation.utenlandsoppholdNeste12Mnd.utenlandsopphold_ikke_registrert',
        utenlandsopphold_overlapper: 'validation.utenlandsoppholdNeste12Mnd.utenlandsopphold_overlapper',
        utenlandsopphold_utenfor_periode: 'validation.utenlandsoppholdNeste12Mnd.utenlandsopphold_utenfor_periode',
    },
};

const validateHarBoddUtenforNorgeSiste12Mnd = (value: any): string | undefined =>
    getYesOrNoValidator()(value) ? MedlemskapFieldErrors.harBoddUtenforNorgeSiste12Mnd.yesOrNoIsUnanswered : undefined;

const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): string | undefined => {
    if (utenlandsopphold.length === 0) {
        return MedlemskapFieldErrors.utenlandsoppholdSiste12Mnd.utenlandsopphold_ikke_registrert;
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return MedlemskapFieldErrors.utenlandsoppholdSiste12Mnd.utenlandsopphold_overlapper;
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return MedlemskapFieldErrors.utenlandsoppholdSiste12Mnd.utenlandsopphold_utenfor_periode;
    }
    return undefined;
};

const validateSkalBoUtenforNorgeNeste12Mnd = (value: any): string | undefined =>
    getYesOrNoValidator()(value) ? MedlemskapFieldErrors.skalBoUtenforNorgeNeste12Mnd.yesOrNoIsUnanswered : undefined;

const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): string | undefined => {
    if (utenlandsopphold.length === 0) {
        return MedlemskapFieldErrors.utenlandsoppholdNeste12Mnd.utenlandsopphold_ikke_registrert;
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return MedlemskapFieldErrors.utenlandsoppholdNeste12Mnd.utenlandsopphold_overlapper;
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return MedlemskapFieldErrors.utenlandsoppholdNeste12Mnd.utenlandsopphold_utenfor_periode;
    }
    return undefined;
};

const MedlemskapStepFieldValidations = {
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: validateHarBoddUtenforNorgeSiste12Mnd,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: validateUtenlandsoppholdSiste12Mnd,
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: validateSkalBoUtenforNorgeNeste12Mnd,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: validateUtenlandsoppholdNeste12Mnd,
};

export default MedlemskapStepFieldValidations;
