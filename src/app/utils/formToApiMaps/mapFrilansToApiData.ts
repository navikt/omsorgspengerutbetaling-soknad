import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { Frilans } from '../../types/SøknadApiData';

export const mapFrilansToApiData = (
    jobberFortsattSomFrilans: YesOrNo | undefined,
    startdato: string | undefined
): Frilans | undefined => {
    const startDate = datepickerUtils.getDateFromDateString(startdato);
    if (jobberFortsattSomFrilans && startDate) {
        const frilans: Frilans = {
            startdato: formatDateToApiFormat(startDate),
            jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
        };
        return frilans;
    }
    return undefined;
};
