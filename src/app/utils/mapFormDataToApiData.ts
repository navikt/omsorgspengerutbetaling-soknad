import { IntlShape } from 'react-intl';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Utenlandsopphold, Virksomhet } from '@navikt/sif-common-forms/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import {
    SøknadApiData, Utbetalingsperiode, UtenlandsoppholdApiData, VirksomhetApiData,
    YesNoSpørsmålOgSvar, YesNoSvar
} from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';
import { mapVirksomhetToVirksomhetApiData } from './formToApiMaps/mapVirksomhetToApiData';

// TODO: FIX MAPPING!!!
export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // STEG 1: Kvalifisering
        tre_eller_fler_barn,
        alene_om_omsorg_for_barn,
        rett_til_mer_enn_ti_dager_totalt,
        den_andre_forelderen_ikke_kan_ta_seg_av_barnet,
        har_barn_som_har_kronisk_sykdom_eller_funksjonshemming,

        // STEG 2: Har betalt ut 10 første dager
        har_utbetalt_ti_dager,
        innvilget_utvidet_rett,
        ingen_andre_barn_under_tolv,
        fisker_på_blad_B,
        frivillig_forsikring,
        nettop_startet_selvstendig_frilanser,

        // STEG 3: Periode
        perioderMedFravær,
        dagerMedDelvisFravær,
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,

        // STEG 6: Inntekt
        frilans_startdato,
        frilans_jobberFortsattSomFrilans,
        selvstendig_harHattInntektSomSN,
        selvstendig_virksomheter,

        // STEG 7: Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd
    }: SøknadFormData,
    intl: IntlShape
): SøknadApiData => {
    const stegEn: YesNoSpørsmålOgSvar[] = [
        {
            spørsmål: intl.formatMessage({ id: 'step.situasjon.tre_eller_fler_barn.spm' }),
            svar: mapYesOrNoToSvar(tre_eller_fler_barn)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.situasjon.alene_om_omsorg_for_barn.spm'
            }),
            svar: mapYesOrNoToSvar(alene_om_omsorg_for_barn)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.situasjon.rett_til_mer_enn_ti_dager_totalt.spm'
            }),
            svar: mapYesOrNoToSvar(rett_til_mer_enn_ti_dager_totalt)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.situasjon.den_andre_forelderen_ikke_kan_ta_seg_av_barnet.spm'
            }),
            svar: mapYesOrNoToSvar(den_andre_forelderen_ikke_kan_ta_seg_av_barnet)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.situasjon.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming.spm'
            }),
            svar: mapYesOrNoToSvar(har_barn_som_har_kronisk_sykdom_eller_funksjonshemming)
        }
    ];

    const leggTilDisseHvis = (yesOrNo: YesOrNo): YesNoSpørsmålOgSvar[] => {
        return yesOrNo === YesOrNo.NO
            ? [
                  {
                      spørsmål: intl.formatMessage({
                          id: 'step.har_utbetalt_de_første_ti_dagene.innvilget_utvidet_rett.spm'
                      }),
                      svar: mapYesOrNoToSvar(innvilget_utvidet_rett)
                  },
                  {
                      spørsmål: intl.formatMessage({
                          id: 'step.har_utbetalt_de_første_ti_dagene.ingen_andre_barn_under_tolv.spm'
                      }),
                      svar: mapYesOrNoToSvar(ingen_andre_barn_under_tolv)
                  },
                  {
                      spørsmål: intl.formatMessage({
                          id: 'step.har_utbetalt_de_første_ti_dagene.fisker_på_blad_B.spm'
                      }),
                      svar: mapYesOrNoToSvar(fisker_på_blad_B)
                  },
                  {
                      spørsmål: intl.formatMessage({
                          id: 'step.har_utbetalt_de_første_ti_dagene.frivillig_forsikring.spm'
                      }),
                      svar: mapYesOrNoToSvar(frivillig_forsikring)
                  },
                  {
                      spørsmål: intl.formatMessage({
                          id: 'step.har_utbetalt_de_første_ti_dagene.nettop_startet_selvstendig_frilanser.spm'
                      }),
                      svar: mapYesOrNoToSvar(nettop_startet_selvstendig_frilanser)
                  }
              ]
            : [];
    };

    const stegTo: YesNoSpørsmålOgSvar[] = [
        {
            spørsmål: intl.formatMessage({ id: 'step.egenutbetaling.ja_nei_spm.legend' }),
            svar: mapYesOrNoToSvar(har_utbetalt_ti_dager)
        },
        ...leggTilDisseHvis(har_utbetalt_ti_dager)
    ];

    const apiData: SøknadApiData = {
        språk: (intl.locale as any) === 'en' ? 'nn' : (intl.locale as Locale),
        bekreftelser: {
            harForståttRettigheterOgPlikter,
            harBekreftetOpplysninger
        },
        spørsmål: [...stegEn, ...stegTo],
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær),
        bosteder: settInnBosteder(
            harBoddUtenforNorgeSiste12Mnd,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            utenlandsoppholdNeste12Mnd,
            intl.locale
        ), // medlemskap siden
        opphold: settInnOpphold(perioder_harVærtIUtlandet, perioder_utenlandsopphold, intl.locale), // periode siden, har du oppholdt
        frilans: mapFrilansToApiData(frilans_jobberFortsattSomFrilans, frilans_startdato),
        selvstendigVirksomheter: settInnVirksomheter(selvstendig_harHattInntektSomSN, selvstendig_virksomheter)
    };

    return apiData;
};

export const mapPeriodeTilUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): Utbetalingsperiode[] => {
    const periodeMappedTilUtbetalingsperiode: Utbetalingsperiode[] = perioderMedFravær.map(
        (periode: Periode): Utbetalingsperiode => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fom),
                tilOgMed: formatDateToApiFormat(periode.tom)
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: Utbetalingsperiode[] = dagerMedDelvisFravær.map(
        (fravær: FraværDelerAvDag): Utbetalingsperiode => {
            const duration: string = timeToIso8601Duration(decimalTimeToTime(fravær.timer));
            return {
                fraOgMed: formatDateToApiFormat(fravær.dato),
                tilOgMed: formatDateToApiFormat(fravær.dato),
                lengde: duration
            };
        }
    );

    return [...periodeMappedTilUtbetalingsperiode, ...fraværDeleravDagMappedTilUtbetalingsperiode];
};

export const mapYesOrNoToSvar = (input: YesOrNo): YesNoSvar => {
    return input === YesOrNo.YES;
};

const settInnBosteder = (
    harBoddUtenforNorgeSiste12Mnd: YesOrNo,
    utenlandsoppholdSiste12Mnd: Utenlandsopphold[],
    skalBoUtenforNorgeNeste12Mnd: YesOrNo,
    utenlandsoppholdNeste12Mnd: Utenlandsopphold[],
    locale: string
): UtenlandsoppholdApiData[] => {
    const mappedSiste12Mnd =
        harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
            ? utenlandsoppholdSiste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
                  return mapBostedUtlandToApiData(utenlandsopphold, locale);
              })
            : [];

    const mappedNeste12Mnd =
        skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
            ? utenlandsoppholdNeste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
                  return mapBostedUtlandToApiData(utenlandsopphold, locale);
              })
            : [];

    return [...mappedSiste12Mnd, ...mappedNeste12Mnd];
};

const settInnOpphold = (
    periodeHarVærtIUtlandet: YesOrNo,
    periodeUtenlandsopphold: Utenlandsopphold[],
    locale: string
) => {
    return periodeHarVærtIUtlandet === YesOrNo.YES
        ? periodeUtenlandsopphold.map((utenlandsopphold: Utenlandsopphold) => {
              return mapBostedUtlandToApiData(utenlandsopphold, locale);
          })
        : [];
};

const settInnVirksomheter = (harHattInntektSomSN?: YesOrNo, virksomheter?: Virksomhet[]): VirksomhetApiData[] => {
    return harHattInntektSomSN && harHattInntektSomSN === YesOrNo.YES && virksomheter
        ? virksomheter.map((virksomhet: Virksomhet) => mapVirksomhetToVirksomhetApiData(virksomhet))
        : [];
};
