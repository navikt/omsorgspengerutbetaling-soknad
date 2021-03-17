import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import {
    erArbeidstakerIsValid,
    frilansIsValid,
    selvstendigIsValid,
} from '../søknad/arbeidssituasjon-step/arbeidssituasjonUtils';
import {
    delvisFraværIsValid,
    minimumEnUtbetalingsperiode,
    oppholdIsValid,
    fraværsperioderIsValid,
} from '../søknad/fravær-step/fraværStepConfig';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

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
    return frilansIsValid(formData) && selvstendigIsValid(formData) && erArbeidstakerIsValid(formData.er_arbeidstaker);
};

export const barnStepIsValid = ({ harAleneomsorg, harAleneomsorgFor = [] }: SøknadFormData): boolean => {
    if (harAleneomsorg === YesOrNo.UNANSWERED) {
        return false;
    }
    if (harAleneomsorg === YesOrNo.YES && harAleneomsorgFor.length === 0) {
        return false;
    }
    return true;
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
