import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
import { validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';

enum FraværErrors {
    ulikeÅrstall = 'ulikeÅrstall',
}

export const getFraværPerioderValidator = ({
    fraværDager,
    årstall,
}: {
    fraværDager: FraværDag[];
    årstall?: number;
}) => (fraværPerioder: FraværPeriode[]) => {
    return validateAll<ValidationError>([
        () => getListValidator({ required: true })(fraværPerioder),
        () => (fraværPerioderHarÅrstall(fraværPerioder, årstall) === false ? FraværErrors.ulikeÅrstall : undefined),
        () => validateNoCollisions(fraværDager, fraværPerioder),
    ]);
};

export const getFraværDagerValidator = ({
    fraværPerioder,
    årstall,
}: {
    fraværPerioder: FraværPeriode[];
    årstall?: number;
}) => (fraværDager: FraværDag[]) => {
    return validateAll<ValidationError>([
        () => getListValidator({ required: true })(fraværDager),
        () => (fraværDagerHarÅrstall(fraværDager, årstall) === false ? FraværErrors.ulikeÅrstall : undefined),
        () => validateNoCollisions(fraværDager, fraværPerioder),
    ]);
};

const fraværPerioderHarÅrstall = (perioder: FraværPeriode[], årstall?: number): boolean => {
    if (årstall !== undefined) {
        return perioder.find((p) => p.fraOgMed.getFullYear() !== årstall || p.tilOgMed.getFullYear() !== årstall)
            ? false
            : true;
    }
    return true;
};

const fraværDagerHarÅrstall = (dager: FraværDag[], årstall?: number): boolean => {
    if (årstall !== undefined) {
        return dager.find((d) => d.dato.getFullYear() !== årstall) ? false : true;
    }
    return true;
};
