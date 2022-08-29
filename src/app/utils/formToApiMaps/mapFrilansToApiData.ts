import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToISODate } from '@navikt/sif-common-utils';
import { Frilans } from '../../types/SøknadApiData';

export const mapFrilansToApiData = (
    erFrilanser: YesOrNo,
    jobberFortsattSomFrilans: YesOrNo | undefined,
    startdato: string | undefined,
    sluttdato: string | undefined
): Frilans | undefined => {
    const startDate = datepickerUtils.getDateFromDateString(startdato);
    const endDate = datepickerUtils.getDateFromDateString(sluttdato);

    if (erFrilanser === YesOrNo.YES && startDate) {
        if (jobberFortsattSomFrilans === YesOrNo.NO && endDate === undefined) {
            return undefined;
        }
        const frilans: Frilans = {
            startdato: dateToISODate(startDate),
            jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
            sluttdato: endDate ? dateToISODate(endDate) : undefined,
        };
        return frilans;
    }
    return undefined;
};
