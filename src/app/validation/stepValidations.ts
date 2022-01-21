import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import { minstEtBarn12årIårellerYngre } from '../søknad/dine-barn-step/DineBarnStep';
import { frilansIsValid, selvstendigIsValid } from '../søknad/arbeidssituasjon-step/arbeidssituasjonUtils';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    delvisFraværIsValid,
    fraværsperioderIsValid,
    minimumEnUtbetalingsperiode,
    oppholdIsValid,
} from './fraværStepValidation';
import { Barn } from '../types/Søkerdata';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const dineBarnStepIsValid = (formData: SøknadFormData, registrerteBarn: Barn[]): boolean => {
    if (minstEtBarn12årIårellerYngre(registrerteBarn, formData.andreBarn)) {
        return (
            formData.harUtvidetRett === YesOrNo.UNANSWERED &&
            formData.harUtvidetRettFor.length === 0 &&
            formData.harDekketTiFørsteDagerSelv === true
        );
    }
    if (minstEtBarn12årIårellerYngre(registrerteBarn, formData.andreBarn) === false) {
        return (
            formData.harDekketTiFørsteDagerSelv === undefined &&
            formData.harUtvidetRett === YesOrNo.YES &&
            formData.harUtvidetRettFor.length > 0
        );
    }
    return false;
};

export const fraværStepIsValid = (formData: SøknadFormData): boolean => {
    const harPerioderMedFravær: YesOrNo = formData[SøknadFormField.harPerioderMedFravær];
    const fraværPerioder: FraværPeriode[] = formData.fraværPerioder;
    const harDagerMedDelvisFravær: YesOrNo = formData[SøknadFormField.harDagerMedDelvisFravær];
    const fraværDager: FraværDag[] = formData.fraværDager;
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioder_harVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioder_utenlandsopphold];

    const isValid = !!(
        fraværsperioderIsValid(harPerioderMedFravær, fraværPerioder) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, fraværDager) &&
        oppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
        minimumEnUtbetalingsperiode(fraværPerioder, fraværDager)
    );
    return isValid;
};

export const arbeidssituasjonStepIsValid = (formData: SøknadFormData): boolean => {
    return frilansIsValid(formData) && selvstendigIsValid(formData);
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
