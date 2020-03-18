import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { SpørsmålId, SpørsmålOgSvar, Svar, SøknadApiData, UtbetalingsperiodeMedVedlegg } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { IntlShape } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { formatDateToApiFormat } from 'common/utils/dateUtils';

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
    // innvilget_rett_og_ingen_andre_barn_under_tolv,
    //     fisker_på_blad_B,
    //     frivillig_forsikring,
    //     nettop_startet_selvstendig_frilanser,

    const leggTilHvis = (yesOrNo: YesOrNo): SpørsmålOgSvar[] => {
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
        ...leggTilHvis(har_utbetalt_ti_dager)
    ];

    const sporsmålOgSvar: SpørsmålOgSvar[] = [
        {
            id: SpørsmålId.HarForståttRettigheterOgPlikter,
            spørsmål: intl.formatMessage({ id: 'welcomingPage.samtykke.harForståttLabel' }),
            svar: harForståttRettigheterOgPlikter ? Svar.Ja : Svar.Nei
        },
        {
            id: SpørsmålId.HarBekreftetOpplysninger,
            spørsmål: intl.formatMessage({ id: 'steg.oppsummering.bekrefterOpplysninger' }),
            svar: harBekreftetOpplysninger ? Svar.Ja : Svar.Nei
        },

        // STEG 1: Kvalifisering
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
        },

        // STEG 2:
        ...stegTo
    ];

    const apiData: SøknadApiData = {
        språk: (intl.locale as any) === 'en' ? 'nn' : (intl.locale as Locale),
        spørsmål: sporsmålOgSvar,
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær),
        bosteder: [],
        opphold: []

        // medlemskap: {
        //     harBoddIUtlandetSiste12Mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
        //     skalBoIUtlandetNeste12Mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
        //     utenlandsoppholdSiste12Mnd:
        //         harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
        //             ? utenlandsoppholdSiste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
        //             : [],
        //     utenlandsoppholdNeste12Mnd:
        //         skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
        //             ? utenlandsoppholdNeste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
        //             : []
        // },

        // legeerklæring: legeerklæring
        //     .filter((attachment) => !attachmentUploadHasFailed(attachment))
        //     .map(({ url }) => url!),
    };

    return apiData;
};

export const mapPeriodeTilUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): UtbetalingsperiodeMedVedlegg[] => {
    const periodeMappedTilUtbetalingsperiodeMedVedlegg: UtbetalingsperiodeMedVedlegg[] = perioderMedFravær
        .filter((periode: Periode) => periode.fom && periode.tom)
        .map((periode: Periode) => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fom as Date),
                tilOgMed: formatDateToApiFormat(periode.tom as Date),
                legeerklæringer: [] as string[] // TODO: Legge til vedlegg adresse
            };
        });

    const fraværDeleravDagMappedTilUtbetalingsperiodeMedVedlegg: UtbetalingsperiodeMedVedlegg[] = dagerMedDelvisFravær
        .filter((fravær: FraværDelerAvDag) => fravær.dato && fravær.timer)
        .map((fravær: FraværDelerAvDag) => {
            return {
                fraOgMed: formatDateToApiFormat(fravær.dato as Date),
                tilOgMed: formatDateToApiFormat(fravær.dato as Date),
                lengde: (fravær.timer as number).toString(), // TODO: Her trengs det nok noe mer mapping for å få type Duration som backend trenger
                legeerklæringer: [] // TODO: legge til vedlegg adresse
            };
        });

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

// const mapUtenlandsoppholdTilApiData = (opphold: Utenlandsopphold, locale: string): UtenlandsoppholdApiData => ({
//     landnavn: getCountryName(opphold.landkode, locale),
//     landkode: opphold.landkode,
//     fraOgMed: formatDateToApiFormat(opphold.fom),
//     tilOgMed: formatDateToApiFormat(opphold.tom)
// });
