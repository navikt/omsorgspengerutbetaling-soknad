import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { dateErHelg, FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
import { flatten, uniqBy } from 'lodash';
import { AktivitetFravær, Aktivitet } from '../types/AktivitetFravær';
import { getDatesWithinDateRange, sortByDate } from './dates';
import dayjs from 'dayjs';

export const getUtbetalingsdatoerFraFravær = (perioder: FraværPeriode[], dager: FraværDag[]): Date[] => {
    const datoerIPeriode = perioder.map((p) => getDatesWithinDateRange({ from: p.fraOgMed, to: p.tilOgMed }));
    const datoer: Date[] = uniqBy([...flatten(datoerIPeriode), ...dager.map((d) => d.dato)], (d) => {
        return dateToISOString(d);
    });
    return datoer.filter((d) => dateErHelg(d) === false).sort(sortByDate);
};

export const harFraværSomFrilanser = (dager: AktivitetFravær[] = []) => {
    return dager.some((ff) => ff.aktivitet === Aktivitet.BEGGE || ff.aktivitet === Aktivitet.FRILANSER);
};

export const harFraværSomSN = (fraværFraDag: AktivitetFravær[] = []) => {
    return fraværFraDag.some(
        (ff) => ff.aktivitet === Aktivitet.BEGGE || ff.aktivitet === Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE
    );
};

export const delFraværPeriodeOppIDager = (periode: FraværPeriode): FraværPeriode[] => {
    const datoer = getUtbetalingsdatoerFraFravær([periode], []);
    return datoer.map((dato) => ({
        ...periode,
        fraOgMed: dato,
        tilOgMed: dato,
    }));
};

export const delFraværPerioderOppIDager = (perioder: FraværPeriode[]): FraværPeriode[] => {
    return flatten(perioder.map((p) => delFraværPeriodeOppIDager(p)));
};

export const getAktivitetFromAktivitetFravær = (
    aktivitetFravær: AktivitetFravær[],
    erFrilanser: boolean,
    erSelvstendigNæringsdrivende: boolean
): Aktivitet[] => {
    if (erFrilanser && !erSelvstendigNæringsdrivende) {
        return [Aktivitet.FRILANSER];
    }
    if (erSelvstendigNæringsdrivende && !erFrilanser) {
        return [Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE];
    }
    return [
        ...(harFraværSomFrilanser(aktivitetFravær) ? [Aktivitet.FRILANSER] : []),
        ...(harFraværSomSN(aktivitetFravær) ? [Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE] : []),
    ];
};

export const getAktivitetForDag = (dato: Date, fravær: AktivitetFravær[]): Aktivitet[] => {
    const aktivitetFravær = fravær.find((fa) => dayjs(fa.dato).isSame(dato, 'day'));
    if (!aktivitetFravær) {
        throw new Error('Missing aktivitet for date');
    }
    return aktivitetFravær.aktivitet === Aktivitet.BEGGE
        ? [Aktivitet.FRILANSER, Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE]
        : [aktivitetFravær.aktivitet];
};
