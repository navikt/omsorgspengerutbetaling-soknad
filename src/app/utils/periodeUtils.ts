import { FraværDag, FraværPeriode, FraværÅrsak } from '@navikt/sif-common-forms/lib';
import dayjs, { Dayjs } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

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

export const harFraværPgaSmittevernhensyn = (perioder: FraværPeriode[], dager: FraværDag[]): boolean => {
    return [...perioder, ...dager].findIndex(({ årsak }) => årsak === FraværÅrsak.smittevernhensyn) >= 0;
};

export const harFraværPgaStengBhgSkole = (perioder: FraværPeriode[], dager: FraværDag[]): boolean => {
    return [...perioder, ...dager].findIndex(({ årsak }) => årsak === FraværÅrsak.stengtSkoleBhg) >= 0;
};
