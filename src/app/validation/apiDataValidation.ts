import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { SøknadApiData } from '../types/SøknadApiData';

export const validateSoknadApiData = (apiValues: SøknadApiData): FeiloppsummeringFeil[] => {
    const errors: FeiloppsummeringFeil[] = [];
    const virksomhet = apiValues.selvstendigNæringsdrivende;

    if (virksomhet && virksomhet.regnskapsfører) {
        const { navn, telefon } = virksomhet.regnskapsfører;
        if (!hasValue(navn)) {
            errors.push({
                feilmelding: `Regnskapsførers navn mangler for ${virksomhet.navnPåVirksomheten}. Du må gå tilbake og korrigere dette for å kunne sende inn søknaden`,
                skjemaelementId: '',
            });
        }
        if (!hasValue(telefon)) {
            errors.push({
                feilmelding: `Regnskapsførers telefonnummer mangler for ${virksomhet.navnPåVirksomheten}. . Du må gå tilbake og korrigere dette for å kunne sende inn søknaden`,
                skjemaelementId: '',
            });
        }
    }
    return errors;
};
