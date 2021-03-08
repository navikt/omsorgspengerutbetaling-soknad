import { IntlShape } from 'react-intl';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { Utenlandsopphold, Virksomhet, mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import {
    SøknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    VirksomhetApiData,
    YesNoSpørsmålOgSvar,
    YesNoSvar,
} from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';

const getVedleggUrlFromAttachments = (attachments: Attachment[]): string[] => {
    return (
        attachments
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map(({ url }) => url!)
    );
};

export const mapFormDataToApiData = (formValues: SøknadFormData, intl: IntlShape): SøknadApiData => {
    const {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // Periode
        fraværPerioder,
        fraværDager,
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,
        har_søkt_andre_utbetalinger,
        andre_utbetalinger,

        hjemmePgaStengtBhgSkole,
        dokumenterStengtBkgSkole = [],

        hjemmePgaSmittevernhensyn,
        dokumenterSmittevernhensyn = [],

        // Inntekt
        frilans_harHattInntektSomFrilanser,
        frilans_startdato,
        frilans_jobberFortsattSomFrilans,
        selvstendig_harHattInntektSomSN,
        selvstendig_virksomheter,
        er_arbeidstaker,

        // Barn
        har_fosterbarn,
        fosterbarn,
        har_fått_ekstra_omsorgsdager,

        // Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
    } = formValues;

    const yesOrNoQuestions: YesNoSpørsmålOgSvar[] = [
        {
            spørsmål: intlHelper(intl, 'step.inntekt.er_arbeidstaker'),
            svar: mapYesOrNoToSvar(er_arbeidstaker),
        },
        {
            spørsmål: intl.formatMessage({ id: 'steg.barn.har_fått_ekstra_omsorgsdager.spm' }),
            svar: mapYesOrNoToSvar(har_fått_ekstra_omsorgsdager),
        },
        {
            spørsmål: intlHelper(intl, 'steg.barn.fosterbarn.spm'),
            svar: mapYesOrNoToSvar(har_fosterbarn),
        },
    ];

    if (har_søkt_andre_utbetalinger === YesOrNo.NO) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.periode.har_søkt_andre_utbetalinger.spm'),
            svar: mapYesOrNoToSvar(har_søkt_andre_utbetalinger),
        });
    }

    const vedleggSmittevern = getVedleggUrlFromAttachments(dokumenterSmittevernhensyn);
    const vedleggStengtBhgSkole = getVedleggUrlFromAttachments(dokumenterStengtBkgSkole);

    const apiData: SøknadApiData = {
        språk: (intl.locale as any) === 'en' ? 'nn' : (intl.locale as Locale),
        bekreftelser: {
            harForståttRettigheterOgPlikter,
            harBekreftetOpplysninger,
        },
        spørsmål: [...yesOrNoQuestions],
        andreUtbetalinger: har_søkt_andre_utbetalinger === YesOrNo.YES ? [...andre_utbetalinger] : [],
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(fraværPerioder, fraværDager),
        bosteder: settInnBosteder(
            harBoddUtenforNorgeSiste12Mnd,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            utenlandsoppholdNeste12Mnd,
            intl.locale
        ),
        opphold: settInnOpphold(perioder_harVærtIUtlandet, perioder_utenlandsopphold, intl.locale), // periode siden, har du oppholdt
        frilans: mapFrilansToApiData(
            frilans_harHattInntektSomFrilanser,
            frilans_jobberFortsattSomFrilans,
            frilans_startdato
        ),
        selvstendigVirksomheter: settInnVirksomheter(
            intl.locale,
            selvstendig_harHattInntektSomSN,
            selvstendig_virksomheter
        ),
        hjemmePgaSmittevernhensyn: hjemmePgaSmittevernhensyn === YesOrNo.YES,
        hjemmePgaStengtBhgSkole: isFeatureEnabled(Feature.STENGT_BHG_SKOLE)
            ? hjemmePgaStengtBhgSkole === YesOrNo.YES
            : undefined,
        vedlegg: [...vedleggSmittevern, ...vedleggStengtBhgSkole],
        _vedleggStengtSkole: vedleggStengtBhgSkole,
        _vedleggSmittevern: vedleggSmittevern,
    };

    if (har_fosterbarn === YesOrNo.YES && har_fosterbarn.length > 0) {
        apiData.fosterbarn = fosterbarn.map((barn) => {
            const { fødselsnummer } = barn;
            return { fødselsnummer };
        });
    }

    return apiData;
};

export const mapPeriodeTilUtbetalingsperiode = (
    fraværPerioder: FraværPeriode[],
    fraværDager: FraværDag[]
): UtbetalingsperiodeApi[] => {
    const periodeMappedTilUtbetalingsperiode: UtbetalingsperiodeApi[] = fraværPerioder.map(
        (periode: FraværPeriode): UtbetalingsperiodeApi => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fraOgMed),
                tilOgMed: formatDateToApiFormat(periode.tilOgMed),
                antallTimerPlanlagt: null,
                antallTimerBorte: null,
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: UtbetalingsperiodeApi[] = fraværDager.map(
        (fraværDag: FraværDag): UtbetalingsperiodeApi => {
            return {
                fraOgMed: formatDateToApiFormat(fraværDag.dato),
                tilOgMed: formatDateToApiFormat(fraværDag.dato),
                antallTimerPlanlagt: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerArbeidsdag))),
                antallTimerBorte: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerFravær))),
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

const settInnVirksomheter = (
    locale: string,
    harHattInntektSomSN?: YesOrNo,
    virksomheter?: Virksomhet[],
    harBesvartFiskerPåBladB?: boolean
): VirksomhetApiData[] => {
    return harHattInntektSomSN && harHattInntektSomSN === YesOrNo.YES && virksomheter
        ? virksomheter.map((virksomhet: Virksomhet) =>
              mapVirksomhetToVirksomhetApiData(locale, virksomhet, harBesvartFiskerPåBladB)
          )
        : [];
};
