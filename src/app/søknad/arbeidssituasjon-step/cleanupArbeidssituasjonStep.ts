import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { initialValues, SøknadFormData } from '../../types/SøknadFormData';

export const cleanupArbeidssituasjonStep = (values: SøknadFormData): SøknadFormData => {
    const { frilans_erFrilanser, selvstendig_erSelvstendigNæringsdrivende } = values;
    const cleanedValues = { ...values };

    // Cleanup frilanser
    if (frilans_erFrilanser === YesOrNo.NO) {
        cleanedValues.frilans_jobberFortsattSomFrilans = initialValues.frilans_jobberFortsattSomFrilans;
        cleanedValues.frilans_startdato = initialValues.frilans_startdato;
        cleanedValues.frilans_sluttdato = initialValues.frilans_sluttdato;
    } else {
        if (values.frilans_jobberFortsattSomFrilans === YesOrNo.YES) {
            cleanedValues.frilans_sluttdato = initialValues.frilans_sluttdato;
        }
    }
    // Cleanup selvstendig næringsdrivende
    if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.NO) {
        cleanedValues.selvstendig_virksomhet = undefined;
        cleanedValues.selvstendig_harFlereVirksomheter = undefined;
    }
    return cleanedValues;
};
