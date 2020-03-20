import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik';
import { Næringstype, Virksomhet } from '@navikt/sif-common-forms/lib';
import { VirksomhetApiData } from '../../types/SøknadApiData';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKER) !== undefined;

export const mapVirksomhetToVirksomhetApiData = (virksomhet: Virksomhet): VirksomhetApiData => {
    const registrertINorge = virksomhet.registrertINorge === YesOrNo.YES;
    const harRegnskapsfører = virksomhet.harRegnskapsfører === YesOrNo.YES;

    const data: VirksomhetApiData = {
        naringstype: [...virksomhet.næringstyper],
        navnPaVirksomheten: virksomhet.navnPåVirksomheten,
        registrertINorge,
        ...(registrertINorge
            ? {
                  organisasjonsnummer: virksomhet.organisasjonsnummer
              }
            : {
                  registrertILand: virksomhet.registrertILand
              }),
        fraOgMed: formatDateToApiFormat(virksomhet.fom),
        tilOgMed: virksomhet.erPågående || virksomhet.tom === undefined ? null : formatDateToApiFormat(virksomhet.tom),
        erPagaende: virksomhet.erPågående,
        naringsinntekt: virksomhet.næringsinntekt,
        harRegnskapsforer: harRegnskapsfører
    };

    if (virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår) {
        const harHatt = virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES;
        data.harVarigEndringAvInntektSiste4Kalenderar = harHatt;
        const {
            varigEndringINæringsinntekt_dato,
            varigEndringINæringsinntekt_forklaring,
            varigEndringINæringsinntekt_inntektEtterEndring
        } = virksomhet;
        if (
            harHatt &&
            varigEndringINæringsinntekt_dato &&
            varigEndringINæringsinntekt_inntektEtterEndring !== undefined &&
            varigEndringINæringsinntekt_forklaring
        ) {
            data.varigEndring = {
                dato: formatDateToApiFormat(varigEndringINæringsinntekt_dato),
                forklaring: varigEndringINæringsinntekt_forklaring,
                inntektEtterEndring: varigEndringINæringsinntekt_inntektEtterEndring
            };
        }
    }

    if (harFiskerNæringstype(virksomhet.næringstyper) && virksomhet.fiskerErPåBladB) {
        data.fiskerErPåBladB = virksomhet.fiskerErPåBladB === YesOrNo.YES;
    }

    if (virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene) {
        const harBlittAktiv = virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES;
        data.harBlittYrkesaktivSisteTreFerdigliknendeArene = harBlittAktiv;
        if (harBlittAktiv && virksomhet.oppstartsdato) {
            data.yrkesaktivSisteTreFerdigliknedeArene = {
                oppstartsdato: formatDateToApiFormat(virksomhet.oppstartsdato)
            };
        }
    }

    if (harRegnskapsfører) {
        data.regnskapsforer = {
            navn: virksomhet.regnskapsfører_navn!,
            telefon: virksomhet.regnskapsfører_telefon!,
            erNarVennFamilie: false // TODO: Må legges til i komponenten som spørsmål?
        };
    }

    if (!harRegnskapsfører) {
        data.harRevisor = virksomhet.harRevisor === YesOrNo.YES;
        if (virksomhet.harRevisor === YesOrNo.YES) {
            data.revisor = {
                navn: virksomhet.revisor_navn!,
                telefon: virksomhet.revisor_telefon!,
                kanInnhenteOpplysninger: virksomhet.kanInnhenteOpplsyningerFraRevisor === YesOrNo.YES,
                erNarVennFamilie: false // TODO: Må legges til i komponenten som spørsmål?
            };
        }
    }

    return data;
};
