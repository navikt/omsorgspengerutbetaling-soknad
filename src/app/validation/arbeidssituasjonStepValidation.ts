import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';

export const validerArbeidssituasjon = (showSubmitButton: boolean): ValidationResult<ValidationError> => {
    if (showSubmitButton) {
        return undefined;
    }

    return { key: 'ingenValg' };
};
