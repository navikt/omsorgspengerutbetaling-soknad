import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

export const fraværsperioderIsValid = (harPerioderMedFravær: YesOrNo, fraværPerioder: FraværPeriode[]): boolean =>
    harPerioderMedFravær === YesOrNo.NO || (harPerioderMedFravær === YesOrNo.YES && fraværPerioder.length > 0);

export const delvisFraværIsValid = (harDagerMedDelvisFravær: YesOrNo, fraværDager: FraværDag[]): boolean =>
    harDagerMedDelvisFravær === YesOrNo.NO || (harDagerMedDelvisFravær === YesOrNo.YES && fraværDager.length > 0);

export const oppholdIsValid = (
    perioderHarVærtIUtlandet: YesOrNo,
    perioderUtenlandsopphold: Utenlandsopphold[]
): boolean =>
    perioderHarVærtIUtlandet === YesOrNo.NO ||
    (perioderHarVærtIUtlandet === YesOrNo.YES && perioderUtenlandsopphold.length > 0);

export const minimumEnUtbetalingsperiode = (fraværPeriode: FraværPeriode[], fraværDag: FraværDag[]): boolean =>
    fraværPeriode.length > 0 || fraværDag.length > 0;
