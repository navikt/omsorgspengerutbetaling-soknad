import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getCountryName, YesOrNo } from '@navikt/sif-common-formik';
import { Næringstype, Virksomhet, VirksomhetFormField } from '@navikt/sif-common-forms/lib';
import { VirksomhetApiData } from '../../types/SøknadApiData';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKER) !== undefined;

export const mapVirksomhetToVirksomhetApiData = (
    locale: string,
    virksomhet: Virksomhet,
    harBesvartFikserPåBladB?: boolean
): VirksomhetApiData => {
    const registrertINorge = virksomhet.registrertINorge === YesOrNo.YES;
    const harRegnskapsfører = virksomhet.harRegnskapsfører === YesOrNo.YES;

    const data: VirksomhetApiData = {
        næringstyper: [...virksomhet.næringstyper],
        navnPåVirksomheten: virksomhet.navnPåVirksomheten,
        registrertINorge,
        ...(registrertINorge
            ? {
                  organisasjonsnummer: virksomhet.organisasjonsnummer,
              }
            : {
                  registrertILand: virksomhet.registrertILand
                      ? getCountryName(virksomhet.registrertILand, locale)
                      : undefined,
                  registrertIUtlandet: virksomhet.registrertILand
                      ? {
                            landkode: virksomhet[VirksomhetFormField.registrertILand],
                            landnavn: getCountryName(virksomhet.registrertILand, locale),
                        }
                      : null,
              }),
        fraOgMed: formatDateToApiFormat(virksomhet.fom),
        tilOgMed: virksomhet.erPågående || virksomhet.tom === undefined ? null : formatDateToApiFormat(virksomhet.tom),
        næringsinntekt: virksomhet.næringsinntekt,
    };

    if (virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår) {
        const harHatt = virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES;
        const {
            varigEndringINæringsinntekt_dato,
            varigEndringINæringsinntekt_forklaring,
            varigEndringINæringsinntekt_inntektEtterEndring,
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
                inntektEtterEndring: varigEndringINæringsinntekt_inntektEtterEndring,
            };
        }
    }

    if (harFiskerNæringstype(virksomhet.næringstyper) && harBesvartFikserPåBladB !== true) {
        data.fiskerErPåBladB = virksomhet.fiskerErPåBladB === YesOrNo.YES;
    }

    if (virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene) {
        const harBlittAktiv = virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES;
        if (harBlittAktiv && virksomhet.oppstartsdato) {
            data.yrkesaktivSisteTreFerdigliknedeÅrene = {
                oppstartsdato: formatDateToApiFormat(virksomhet.oppstartsdato),
            };
        }
    }

    if (harRegnskapsfører && virksomhet.regnskapsfører_navn && virksomhet.regnskapsfører_telefon) {
        data.regnskapsfører = {
            navn: virksomhet.regnskapsfører_navn,
            telefon: virksomhet.regnskapsfører_telefon,
        };
    }

    return data;
};
