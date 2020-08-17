import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { Frilans } from '../../types/SøknadApiData';

export const mapFrilansToApiData = (
    jobberFortsattSomFrilans: YesOrNo | undefined,
    startdato: Date | undefined
): Frilans | undefined => {
    if (jobberFortsattSomFrilans && startdato) {
        const frilans: Frilans = {
            startdato: formatDateToApiFormat(startdato),
            jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
        };
        return frilans;
    }
    return undefined;
};
