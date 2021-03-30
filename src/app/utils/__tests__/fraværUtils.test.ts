import { dateErHelg, FraværDag, FraværPeriode, FraværÅrsak } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';
import { Aktivitet } from '../../types/AktivitetFravær';
import {
    delFraværPeriodeOppIDager,
    delFraværPerioderOppIDager,
    getUtbetalingsdatoerFraFravær,
    harFraværSomFrilanser,
    harFraværSomSN,
} from '../fraværUtils';

describe('fraværUtils', () => {
    describe('getUtbetalingsdatoerFraPerioderOgDager', () => {
        const periodeFre: FraværPeriode = {
            fraOgMed: new Date(2020, 9, 9),
            tilOgMed: new Date(2020, 9, 9),
            årsak: FraværÅrsak.ordinært,
        };
        const periodeManFre: FraværPeriode = {
            fraOgMed: new Date(2020, 9, 12),
            tilOgMed: new Date(2020, 9, 16),
            årsak: FraværÅrsak.ordinært,
        };
        const periodeManTir: FraværPeriode = {
            fraOgMed: new Date(2020, 9, 19),
            tilOgMed: new Date(2020, 9, 20),
            årsak: FraværÅrsak.ordinært,
        };
        const dagUnikMan: FraværDag = {
            dato: new Date(2020, 9, 26),
            timerArbeidsdag: '5',
            timerFravær: '2',
            årsak: FraværÅrsak.ordinært,
        };
        const dagIPeriodeManFre: FraværDag = {
            dato: new Date(2020, 9, 15),
            timerArbeidsdag: '5',
            timerFravær: '2',
            årsak: FraværÅrsak.ordinært,
        };

        const periodeTorsdagTilMandag: FraværPeriode = {
            fraOgMed: new Date(2021, 2, 25),
            tilOgMed: new Date(2021, 2, 29),
            årsak: FraværÅrsak.stengtSkoleBhg,
        };

        it('flattens an array of perioder', () => {
            const dates = getUtbetalingsdatoerFraFravær([periodeFre, periodeManFre], []);
            expect(dates.length).toBe(6);
        });
        it('Includes fraværsdager', () => {
            const dates = getUtbetalingsdatoerFraFravær([periodeFre, periodeManFre], [dagUnikMan]);
            expect(dates.length).toBe(7);
        });
        it('Removes duplicate dates in perioder', () => {
            const dates = getUtbetalingsdatoerFraFravær([periodeManFre, periodeManTir], []);
            expect(dates.length).toBe(7);
        });
        it('Removes duplicate dates in perioder and dager', () => {
            const dates = getUtbetalingsdatoerFraFravær([periodeManFre, periodeManTir], [dagIPeriodeManFre]);
            expect(dates.length).toBe(7);
        });
        it('Removes duplicate dates in dager dager', () => {
            const dates = getUtbetalingsdatoerFraFravær([], [dagIPeriodeManFre, { ...dagIPeriodeManFre }]);
            expect(dates.length).toBe(1);
        });
        it('removes saturday and sunday from fraværPeriode', () => {
            const datoer = getUtbetalingsdatoerFraFravær([periodeTorsdagTilMandag], []);
            expect(datoer.length).toBe(3);
            expect(dateErHelg(datoer[0])).toBeFalsy();
            expect(dateErHelg(datoer[1])).toBeFalsy();
            expect(dateErHelg(datoer[2])).toBeFalsy();
        });
    });

    describe('harFraværFraSom frilanser', () => {
        it(`Returns false when aktivitet contains only ${Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE}`, () => {
            expect(
                harFraværSomFrilanser([{ dato: new Date(), aktivitet: Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE }])
            ).toBeFalsy();
        });
        it(`Returns true when aktivitet is ${Aktivitet.FRILANSER}`, () => {
            expect(harFraværSomFrilanser([{ dato: new Date(), aktivitet: Aktivitet.FRILANSER }])).toBeTruthy();
            expect(
                harFraværSomFrilanser([
                    {
                        dato: new Date(),
                        aktivitet: Aktivitet.BEGGE,
                    },
                ])
            ).toBeTruthy();
        });
    });
    describe('harFraværSom selvstendig næringsdrivende', () => {
        it(`Returns false when aktivitet contains only ${Aktivitet.FRILANSER}`, () => {
            expect(harFraværSomSN([{ dato: new Date(), aktivitet: Aktivitet.FRILANSER }])).toBeFalsy();
        });
        it(`Returns true when aktivitet is ${Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE}`, () => {
            expect(
                harFraværSomSN([{ dato: new Date(), aktivitet: Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE }])
            ).toBeTruthy();
            expect(
                harFraværSomSN([
                    {
                        dato: new Date(),
                        aktivitet: Aktivitet.BEGGE,
                    },
                ])
            ).toBeTruthy();
        });
    });

    describe('delFraværPeriodeOppIDager', () => {
        const periodeEnDag: FraværPeriode = {
            fraOgMed: new Date(2020, 10, 10),
            tilOgMed: new Date(2020, 10, 10),
            årsak: FraværÅrsak.stengtSkoleBhg,
        };
        const periodeTreDager: FraværPeriode = {
            fraOgMed: new Date(2020, 10, 10),
            tilOgMed: new Date(2020, 10, 12),
            årsak: FraværÅrsak.stengtSkoleBhg,
        };
        it('returns same FraværPeriode when duration is only one day', () => {
            expect(delFraværPeriodeOppIDager(periodeEnDag).length).toEqual(1);
        });
        it('returns three FraværPeriode when duration is three days', () => {
            expect(delFraværPeriodeOppIDager(periodeTreDager).length).toEqual(3);
        });
        it('fraOgMed and tilOgMed is the same date for each periode', () => {
            const formatDate = (date: Date) => dayjs(date).format('DD/MM/YYYY');
            const perioder = delFraværPeriodeOppIDager(periodeTreDager);
            expect(formatDate(perioder[0].fraOgMed)).toEqual(formatDate(perioder[0].tilOgMed));
            expect(formatDate(perioder[1].fraOgMed)).toEqual(formatDate(perioder[1].tilOgMed));
            expect(formatDate(perioder[2].fraOgMed)).toEqual(formatDate(perioder[2].tilOgMed));
        });
        it('retains the same årsak when periode is three days', () => {
            const perioder = delFraværPeriodeOppIDager(periodeTreDager);
            expect(perioder[0].årsak).toEqual(periodeTreDager.årsak);
            expect(perioder[1].årsak).toEqual(periodeTreDager.årsak);
            expect(perioder[2].årsak).toEqual(periodeTreDager.årsak);
        });
    });
    describe('delFraværPerioderOppIDager', () => {
        const periodeEnDag: FraværPeriode = {
            fraOgMed: new Date(2020, 10, 10),
            tilOgMed: new Date(2020, 10, 10),
            årsak: FraværÅrsak.stengtSkoleBhg,
        };
        const periodeTreDager: FraværPeriode = {
            fraOgMed: new Date(2020, 10, 11),
            tilOgMed: new Date(2020, 10, 13),
            årsak: FraværÅrsak.stengtSkoleBhg,
        };
        it('returns PeriodeFravær for mulitple perioder', () => {
            expect(delFraværPerioderOppIDager([periodeEnDag, periodeTreDager]).length).toBe(4);
        });
    });
});
