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
    ApiBarn,
    SøknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    VirksomhetApiData,
    YesNoSpørsmålOgSvar,
    YesNoSvar,
} from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
// import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';
import { Barn } from '../../@types/omsorgspengerutbetaling-schema';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';

const getVedleggUrlFromAttachments = (attachments: Attachment[]): string[] => {
    return (
        attachments
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map(({ url }) => url!)
    );
};

export const mapFormDataToApiData = (formValues: SøknadFormData, barn: Barn[], intl: IntlShape): SøknadApiData => {
    const {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // Fravær
        fraværPerioder,
        fraværDager,
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,
        har_søkt_andre_utbetalinger,
        andre_utbetalinger,

        dokumenterStengtBkgSkole = [],
        dokumenterSmittevernhensyn = [],

        // Inntekt
        frilans_erFrilanser,
        frilans_startdato,
        frilans_sluttdato,
        frilans_jobberFortsattSomFrilans,
        selvstendig_erSelvstendigNæringsdrivende,
        selvstendig_virksomheter,
        er_arbeidstaker,

        // Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
    } = formValues;

    const yesOrNoQuestions: YesNoSpørsmålOgSvar[] = [
        {
            spørsmål: intlHelper(intl, 'step.arbeidssituasjon.er_arbeidstaker'),
            svar: mapYesOrNoToSvar(er_arbeidstaker),
        },
    ];

    if (har_søkt_andre_utbetalinger === YesOrNo.NO) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.fravaer.har_søkt_andre_utbetalinger.spm'),
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
            frilans_erFrilanser,
            frilans_jobberFortsattSomFrilans,
            frilans_startdato,
            frilans_sluttdato
        ),
        selvstendigVirksomheter: settInnVirksomheter(
            intl.locale,
            selvstendig_erSelvstendigNæringsdrivende,
            selvstendig_virksomheter
        ),
        vedlegg: [...vedleggSmittevern, ...vedleggStengtBhgSkole],
        _vedleggStengtSkole: vedleggStengtBhgSkole,
        _vedleggSmittevern: vedleggSmittevern,
        barn: mapBarnToApiData(formValues, barn),
    };

    return apiData;
};

export const mapBarnToApiData = (
    { harAleneomsorgFor, andreBarn = [] }: SøknadFormData,
    registrerteBarn: Barn[] = []
): ApiBarn[] => {
    return [
        ...andreBarn.map((barn) => mapAnnetBarnToApiBarn(barn, harAleneomsorgFor)),
        ...registrerteBarn.map((barn) => mapBarnToApiBarn(barn, harAleneomsorgFor)),
    ];
};

const barnFinnesIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const mapAnnetBarnToApiBarn = (annetBarn: AnnetBarn, harAleneomsorgFor: string[]): ApiBarn => {
    return {
        navn: annetBarn.navn,
        aktørId: undefined,
        identitetsnummer: annetBarn.fnr,
        aleneOmOmsorgen: barnFinnesIArray(annetBarn.fnr, harAleneomsorgFor),
    };
};

export const mapBarnToApiBarn = (registrertBarn: Barn, harAleneomsorgFor: string[]): ApiBarn => {
    return {
        navn: formatName(registrertBarn.fornavn, registrertBarn.etternavn, registrertBarn.mellomnavn),
        aktørId: registrertBarn.aktørId,
        identitetsnummer: undefined,
        aleneOmOmsorgen: barnFinnesIArray(registrertBarn.aktørId, harAleneomsorgFor),
    };
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
    erSelvstendigNæringsdrivende?: YesOrNo,
    virksomheter?: Virksomhet[],
    harBesvartFiskerPåBladB?: boolean
): VirksomhetApiData[] => {
    return erSelvstendigNæringsdrivende && erSelvstendigNæringsdrivende === YesOrNo.YES && virksomheter
        ? virksomheter.map((virksomhet: Virksomhet) =>
              mapVirksomhetToVirksomhetApiData(locale, virksomhet, harBesvartFiskerPåBladB)
          )
        : [];
};
