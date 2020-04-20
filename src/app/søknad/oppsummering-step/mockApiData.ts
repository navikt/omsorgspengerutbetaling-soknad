import { Næringstype } from '@navikt/sif-common-forms/lib';
import { SøknadApiData } from '../../types/SøknadApiData';

export const mock1: SøknadApiData = {
    språk: 'nb',
    bekreftelser: {
        harForståttRettigheterOgPlikter: false,
        harBekreftetOpplysninger: false
    },
    spørsmål: [
        {
            spørsmål: 'Jeg har 3 eller flere barn',
            svar: false
        },
        {
            spørsmål: 'Jeg er alene om omsorg for barn',
            svar: true
        },
        {
            spørsmål: 'Jeg har fått overført dager og rett til mer enn 10 dager totalt',
            svar: false
        },
        {
            spørsmål: 'Jeg har innvilget ekstra dager fordi den andre forelderen ikke kan ta seg av barnet',
            svar: true
        },
        {
            spørsmål: 'Jeg har innvilget ekstra dager fordi jeg har barn som har kronisk sykdom/funksjonshemming',
            svar: false
        },
        {
            spørsmål: 'Har du utbetalt 10 dager for deg selv i dette kalenderåret?',
            svar: false
        },
        {
            spørsmål: 'Jeg har innvilget utvidet rett for et kronisk sykt barn/funksjonshemmet',
            svar: true
        },
        {
            spørsmål: 'Jeg har ingen andre barn under 12 år',
            svar: false
        },
        {
            spørsmål: 'Jeg er fisker på blad B',
            svar: true
        },
        {
            spørsmål: 'Jeg har frivillig forsikring for tilleggssykepenger fra 1. dag',
            svar: false
        },
        {
            spørsmål: 'Jeg har nettopp startet å jobbe som selvstendig/frilanser og jobbet under 4 uker',
            svar: false
        }
    ],
    utbetalingsperioder: [
        {
            fraOgMed: '2020-03-02',
            tilOgMed: '2020-03-03'
        },
        {
            fraOgMed: '2020-03-04',
            tilOgMed: '2020-03-05'
        },
        {
            fraOgMed: '2020-03-09',
            tilOgMed: '2020-03-09',
            lengde: 'PT5H0M'
        },
        {
            fraOgMed: '2020-03-10',
            tilOgMed: '2020-03-10',
            lengde: 'PT4H0M'
        }
    ],
    hjemmePgaSmittevernhensyn: false,
    vedlegg: [],
    andreUtbetalinger: [],
    bosteder: [
        {
            landnavn: 'Vietnam',
            landkode: 'VN',
            fraOgMed: '2020-02-01',
            tilOgMed: '2020-02-10',
            erEØSLand: true
        },
        {
            landnavn: 'Madagaskar',
            landkode: 'MG',
            fraOgMed: '2020-04-21',
            tilOgMed: '2020-04-30',
            erEØSLand: true
        }
    ],
    opphold: [
        {
            landnavn: 'Hviterussland',
            landkode: 'BY',
            fraOgMed: '2020-02-01',
            tilOgMed: '2020-02-15',
            erEØSLand: true
        },
        {
            landnavn: 'Wallis- og Futunaøyene',
            landkode: 'WF',
            fraOgMed: '2020-02-24',
            tilOgMed: '2020-02-29',
            erEØSLand: true
        }
    ],
    frilans: {
        startdato: '2016-12-15',
        jobberFortsattSomFrilans: true
    },
    selvstendigVirksomheter: [
        {
            næringstyper: [Næringstype.FISKER, Næringstype.JORDBRUK, Næringstype.DAGMAMMA, Næringstype.ANNEN],
            navnPåVirksomheten: 'Navn på virksomheten',
            registrertINorge: false,
            registrertILand: 'ST',
            fraOgMed: '2013-03-04',
            tilOgMed: null,
            fiskerErPåBladB: true,
            regnskapsfører: {
                navn: 'Mr regnskapsfører',
                telefon: '99887766'
            }
        },
        {
            næringstyper: [Næringstype.FISKER, Næringstype.JORDBRUK],
            navnPåVirksomheten: 'Kål og ditt OG datt',
            registrertINorge: false,
            registrertILand: 'BI',
            fraOgMed: '2018-03-01',
            tilOgMed: '2019-03-07',
            næringsinntekt: 12345678,
            fiskerErPåBladB: false
        }
    ]
};
