import {Locale} from '@navikt/sif-common-core/lib/types/Locale';
import {
    SpørsmålOgSvar,
    Svar,
    SøknadApiData,
    UtbetalingsperiodeMedVedlegg,
    UtenlandsoppholdApiData
} from '../types/SøknadApiData';
import {SøknadFormData} from '../types/SøknadFormData';
import {IntlShape} from 'react-intl';
import {YesOrNo} from 'common/types/YesOrNo';
import {FraværDelerAvDag, Periode} from '../../@types/omsorgspengerutbetaling-schema';
import {formatDateToApiFormat} from 'common/utils/dateUtils';
import {decimalTimeToTime, timeToIso8601Duration} from 'common/utils/timeUtils';
import {Utenlandsopphold} from "@navikt/sif-common-forms/lib";
import {mapBostedUtlandToApiData} from "./formToApiMaps/mapBostedUtlandToApiData";

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
        innvilget_rett_og_ingen_andre_barn_under_tolv,
        fisker_på_blad_B,
        frivillig_forsikring,
        nettop_startet_selvstendig_frilanser,

        // STEG 3: Periode
        perioderMedFravær,
        dagerMedDelvisFravær,
        periode_har_vært_i_utlandet,
        periode_utenlandsopphold,

        // STEG 4: Conditional perioder i utlandet
        hvis_utenlandsopphold_en_test_verdi,

        // STEG 5: Legeerklæring
        legeerklæring,

        // STEG 6: Inntekt
        frilans_harHattInntektSomFrilanser,
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
    // TODO: Disse skal bli flyttet. Se oppdatering i api'et
    // const todo = [
    //     {
    //         id: SpørsmålId.HarForståttRettigheterOgPlikter,
    //         spørsmål: intl.formatMessage({ id: 'welcomingPage.samtykke.harForståttLabel' }),
    //         svar: harForståttRettigheterOgPlikter ? Svar.Ja : Svar.Nei
    //     },
    //     {
    //         id: SpørsmålId.HarBekreftetOpplysninger,
    //         spørsmål: intl.formatMessage({ id: 'steg.oppsummering.bekrefterOpplysninger' }),
    //         svar: harBekreftetOpplysninger ? Svar.Ja : Svar.Nei
    //     }
    // ];

    const stegEn: SpørsmålOgSvar[] = [
        {
            spørsmål: intl.formatMessage({ id: 'step.når-kan-man-få-utbetalt-omsorgspenger.tre_eller_fler_barn.spm' }),
            svar: mapYesOrNoToSvar(tre_eller_fler_barn)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.når-kan-man-få-utbetalt-omsorgspenger.alene_om_omsorg_for_barn.spm'
            }),
            svar: mapYesOrNoToSvar(alene_om_omsorg_for_barn)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.når-kan-man-få-utbetalt-omsorgspenger.rett_til_mer_enn_ti_dager_totalt.spm'
            }),
            svar: mapYesOrNoToSvar(rett_til_mer_enn_ti_dager_totalt)
        },
        {
            spørsmål: intl.formatMessage({
                id: 'step.når-kan-man-få-utbetalt-omsorgspenger.den_andre_forelderen_ikke_kan_ta_seg_av_barnet.spm'
            }),
            svar: mapYesOrNoToSvar(den_andre_forelderen_ikke_kan_ta_seg_av_barnet)
        },
        {
            spørsmål: intl.formatMessage({
                id:
                    'step.når-kan-man-få-utbetalt-omsorgspenger.har_barn_som_har_kronisk_sykdom_eller_funksjonshemming.spm'
            }),
            svar: mapYesOrNoToSvar(har_barn_som_har_kronisk_sykdom_eller_funksjonshemming)
        }
    ];

    const leggTilDisseHvis = (yesOrNo: YesOrNo): SpørsmålOgSvar[] => {
        return yesOrNo === YesOrNo.NO
            ? [
                  {
                      spørsmål: intl.formatMessage({
                          id: 'step.har_utbetalt_de_første_ti_dagene.innvilget_rett_og_ingen_andre_barn_under_tolv.spm'
                      }),
                      svar: mapYesOrNoToSvar(innvilget_rett_og_ingen_andre_barn_under_tolv)
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

    const stegTo: SpørsmålOgSvar[] = [
        {
            spørsmål: intl.formatMessage({ id: 'step.har-utbetalt-de-første-ti-dagene.ja_nei_spm.legend' }),
            svar: mapYesOrNoToSvar(har_utbetalt_ti_dager)
        },
        ...leggTilDisseHvis(har_utbetalt_ti_dager)
    ];

    const apiData: SøknadApiData = {
        språk: (intl.locale as any) === 'en' ? 'nn' : (intl.locale as Locale),
        spørsmål: [...stegEn, ...stegTo],
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær),
        bosteder: settInnBosteder(
            harBoddUtenforNorgeSiste12Mnd,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            utenlandsoppholdNeste12Mnd,
            intl.locale
        ), // medlemskap siden
        opphold: settInnOpphold(
            periode_har_vært_i_utlandet,
            periode_utenlandsopphold,
            intl.locale
        ) // periode siden, har du oppholdt

    };

    return apiData;
};

export const mapPeriodeTilUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): UtbetalingsperiodeMedVedlegg[] => {
    const periodeMappedTilUtbetalingsperiodeMedVedlegg: UtbetalingsperiodeMedVedlegg[] = perioderMedFravær.map(
        (periode: Periode) => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fom),
                tilOgMed: formatDateToApiFormat(periode.tom),
                legeerklæringer: [] as string[] // TODO: Legge til vedlegg adresse
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiodeMedVedlegg: UtbetalingsperiodeMedVedlegg[] = dagerMedDelvisFravær.map(
        (fravær: FraværDelerAvDag) => {
            const duration: string = timeToIso8601Duration(decimalTimeToTime(fravær.timer));
            return {
                fraOgMed: formatDateToApiFormat(fravær.dato),
                tilOgMed: formatDateToApiFormat(fravær.dato),
                lengde: duration,
                legeerklæringer: [] // TODO: legge til vedlegg adresse
            };
        }
    );

    return [...periodeMappedTilUtbetalingsperiodeMedVedlegg, ...fraværDeleravDagMappedTilUtbetalingsperiodeMedVedlegg];
};

export const mapYesOrNoToSvar = (input: YesOrNo): Svar => {
    switch (input) {
        case YesOrNo.YES:
            return Svar.Ja;
        case YesOrNo.NO:
            return Svar.Nei;
        case YesOrNo.DO_NOT_KNOW:
            return Svar.VetIkke;
        case YesOrNo.UNANSWERED:
            return Svar.VetIkke;
    }
};

const settInnBosteder = (
    harBoddUtenforNorgeSiste12Mnd: YesOrNo,
    utenlandsoppholdSiste12Mnd: Utenlandsopphold[],
    skalBoUtenforNorgeNeste12Mnd: YesOrNo,
    utenlandsoppholdNeste12Mnd: Utenlandsopphold[],
    locale: string
): UtenlandsoppholdApiData[] => {

    const mappedSiste12Mnd = (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES) ?
        utenlandsoppholdSiste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
            return mapBostedUtlandToApiData(utenlandsopphold, locale);
        }) : [];

    const mappedNeste12Mnd = (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES) ?
        utenlandsoppholdNeste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
            return mapBostedUtlandToApiData(utenlandsopphold, locale);
        }) : [];

    return [
        ...mappedSiste12Mnd,
        ...mappedNeste12Mnd
    ];
};

const settInnOpphold = (
    periodeHarVærtIUtlandet: YesOrNo,
    periodeUtenlandsopphold: Utenlandsopphold[],
    locale: string
) => {
    return periodeHarVærtIUtlandet === YesOrNo.YES ?
        periodeUtenlandsopphold.map((utenlandsopphold: Utenlandsopphold) => {
            return mapBostedUtlandToApiData(utenlandsopphold, locale);
        }): [];
};
