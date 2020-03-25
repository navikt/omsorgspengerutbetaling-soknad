import moment, { Moment } from 'moment';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';

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
