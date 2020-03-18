import moment from 'moment';
import { DatoTidsperiode } from '../types/DatoTidsperiode';

export function isValidTidsperiode(tidsperiode: any): tidsperiode is DatoTidsperiode {
    return (
        tidsperiode.fom !== undefined &&
        tidsperiode.tom !== undefined &&
        moment(tidsperiode.fom).isSameOrBefore(tidsperiode.tom, 'day')
    );
}
