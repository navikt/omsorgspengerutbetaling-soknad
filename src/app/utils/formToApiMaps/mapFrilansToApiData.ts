import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Frilans } from '../../types/SøknadApiData';

export const mapFrilansToApiData = (
    frilans_harHattInntektSomFrilanser: YesOrNo,
    jobberFortsattSomFrilans: YesOrNo | undefined,
    startdato: string | undefined
): Frilans | undefined => {
    const startDate = datepickerUtils.getDateFromDateString(startdato);
    if (frilans_harHattInntektSomFrilanser === YesOrNo.YES && startDate) {
        const frilans: Frilans = {
            startdato: formatDateToApiFormat(startDate),
            jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
        };
        return frilans;
    }
    return undefined;
};
