import {formatDateToApiFormat} from "common/utils/dateUtils";
import {YesOrNo} from "common/types/YesOrNo";
import {ApiStringDate} from "common/types/ApiStringDate";

export interface FrilansApiData {
    startdato: ApiStringDate;
    jobber_fortsatt_som_frilans: boolean;
}

export const mapFrilansToApiData = (frilans_jobberFortsattSomFrilans: YesOrNo, frilans_startdato: Date): FrilansApiData | undefined => {

    if (frilans_jobberFortsattSomFrilans && frilans_startdato) {
        const data: FrilansApiData = {
            startdato: formatDateToApiFormat(frilans_startdato),
            jobber_fortsatt_som_frilans: frilans_jobberFortsattSomFrilans === YesOrNo.YES
        };
        return data;
    }
    return undefined;
};
