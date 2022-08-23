import { IntlShape } from 'react-intl';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { mapVirksomhetToVirksomhetApiData, Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import { ApiAktivitet } from '../types/AktivitetFravær';
import {
    SøknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    YesNoSpørsmålOgSvar,
    YesNoSvar,
} from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';
import { delFraværPerioderOppIDager, getApiAktivitetForDag, getAktivitetFromAktivitetFravær } from './fraværUtils';
import { Barn } from '../types/Søkerdata';
import { mapBarnToApiData } from './formToApiMaps/mapBarnToApiData';
import { getLocaleForApi } from '@navikt/sif-common-core/lib/utils/localeUtils';
import { getAttachmentURLBackend } from './attachmentUtilsAuthToken';

const getVedleggUrlFromAttachments = (attachments: Attachment[]): string[] => {
    return (
        attachments
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map(({ url }) => getAttachmentURLBackend(url))
    );
};

export const mapFormDataToApiData = (
    formValues: SøknadFormData,
    intl: IntlShape,
    registrerteBarn: Barn[]
): SøknadApiData => {
    const {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        //Barn
        andreBarn,
        harUtvidetRettFor,
        harDekketTiFørsteDagerSelv,

        // Fravær

        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,
        harSøktAndreUtbetalinger,
        andreUtbetalinger,

        dokumenterStengtBkgSkole = [],
        dokumenterSmittevernhensyn = [],

        // Inntekt
        frilans_erFrilanser,
        frilans_startdato,
        frilans_sluttdato,
        frilans_jobberFortsattSomFrilans,
        selvstendig_erSelvstendigNæringsdrivende,
        selvstendig_harFlereVirksomheter,
        selvstendig_virksomhet,

        // Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
    } = formValues;

    const yesOrNoQuestions: YesNoSpørsmålOgSvar[] = [];

    if (harSøktAndreUtbetalinger === YesOrNo.NO) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.fravaer.harSøktAndreUtbetalinger.spm'),
            svar: mapYesOrNoToSvar(harSøktAndreUtbetalinger),
        });
    }
    if (frilans_erFrilanser) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'frilanser.erFrilanser.spm'),
            svar: mapYesOrNoToSvar(frilans_erFrilanser),
        });
    }
    if (selvstendig_erSelvstendigNæringsdrivende) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'selvstendig.erDuSelvstendigNæringsdrivende.spm'),
            svar: mapYesOrNoToSvar(selvstendig_erSelvstendigNæringsdrivende),
        });
    }

    const vedleggSmittevern = getVedleggUrlFromAttachments(dokumenterSmittevernhensyn);
    const vedleggStengtBhgSkole = getVedleggUrlFromAttachments(dokumenterStengtBkgSkole);

    const frilans = mapFrilansToApiData(
        frilans_erFrilanser,
        frilans_jobberFortsattSomFrilans,
        frilans_startdato,
        frilans_sluttdato
    );

    const harFlereVirksomheter = selvstendig_harFlereVirksomheter
        ? mapYesOrNoToSvar(selvstendig_harFlereVirksomheter)
        : undefined;

    const virksomhet =
        selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendig_virksomhet !== undefined
            ? mapVirksomhetToVirksomhetApiData(intl.locale, selvstendig_virksomhet, harFlereVirksomheter)
            : undefined;

    const apiData: SøknadApiData = {
        språk: getLocaleForApi(intl.locale),
        bekreftelser: {
            harForståttRettigheterOgPlikter,
            harBekreftetOpplysninger,
        },
        harDekketTiFørsteDagerSelv: harDekketTiFørsteDagerSelv,
        barn: mapBarnToApiData(andreBarn, harUtvidetRettFor, registrerteBarn, harDekketTiFørsteDagerSelv),
        spørsmål: [...yesOrNoQuestions],
        andreUtbetalinger: harSøktAndreUtbetalinger === YesOrNo.YES ? [...andreUtbetalinger] : [],
        utbetalingsperioder: getUtbetalingsperioderApiFromFormData(formValues),
        bosteder: settInnBosteder(
            harBoddUtenforNorgeSiste12Mnd,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            utenlandsoppholdNeste12Mnd,
            intl.locale
        ),
        frilans,
        selvstendigNæringsdrivende: virksomhet,
        opphold: settInnOpphold(perioder_harVærtIUtlandet, perioder_utenlandsopphold, intl.locale), // periode siden, har du oppholdt
        vedlegg: [...vedleggSmittevern, ...vedleggStengtBhgSkole],
        _vedleggStengtSkole: vedleggStengtBhgSkole,
        _vedleggSmittevern: vedleggSmittevern,
        _harSøktAndreUtbetalinger: mapYesOrNoToSvar(harSøktAndreUtbetalinger),
        _varFrilansIPerioden: mapYesOrNoToSvar(frilans_erFrilanser),
        _varSelvstendigNæringsdrivendeIPerioden: mapYesOrNoToSvar(selvstendig_erSelvstendigNæringsdrivende),
    };

    return apiData;
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

export const getUtbetalingsperioderApiFromFormData = (formValues: SøknadFormData): UtbetalingsperiodeApi[] => {
    const {
        fraværDager,
        fraværPerioder,
        aktivitetFravær,
        frilans_erFrilanser,
        selvstendig_erSelvstendigNæringsdrivende,
    } = formValues;
    const erFrilanser = frilans_erFrilanser === YesOrNo.YES;
    const erSN = selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;

    const apiAktivitet: ApiAktivitet[] = getAktivitetFromAktivitetFravær(aktivitetFravær, erFrilanser, erSN);

    if (apiAktivitet.length === 1) {
        return [
            ...fraværDager.map((dag) => mapFraværDagTilUtbetalingsperiodeApi(dag, apiAktivitet)),
            ...fraværPerioder.map((periode) => mapFraværPeriodeTilUtbetalingsperiodeApi(periode, apiAktivitet)),
        ];
    } else if (apiAktivitet.length === 2) {
        return [
            ...fraværDager.map((dag) =>
                mapFraværDagTilUtbetalingsperiodeApi(dag, getApiAktivitetForDag(dag.dato, aktivitetFravær))
            ),
            ...delFraværPerioderOppIDager(fraværPerioder).map((periodeDag) =>
                mapFraværPeriodeTilUtbetalingsperiodeApi(
                    periodeDag,
                    getApiAktivitetForDag(periodeDag.fraOgMed, aktivitetFravær)
                )
            ),
        ];
    } else {
        throw new Error('Missing aktivitet');
    }
};

export const mapFraværPeriodeTilUtbetalingsperiodeApi = (
    periode: FraværPeriode,
    aktivitetFravær: ApiAktivitet[]
): UtbetalingsperiodeApi => {
    return {
        fraOgMed: formatDateToApiFormat(periode.fraOgMed),
        tilOgMed: formatDateToApiFormat(periode.tilOgMed),
        antallTimerPlanlagt: null,
        antallTimerBorte: null,
        årsak: periode.årsak,
        aktivitetFravær,
    };
};

export const mapFraværDagTilUtbetalingsperiodeApi = (
    fraværDag: FraværDag,
    aktivitetFravær: ApiAktivitet[]
): UtbetalingsperiodeApi => {
    return {
        fraOgMed: formatDateToApiFormat(fraværDag.dato),
        tilOgMed: formatDateToApiFormat(fraværDag.dato),
        antallTimerPlanlagt: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerArbeidsdag))),
        antallTimerBorte: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerFravær))),
        årsak: fraværDag.årsak,
        aktivitetFravær,
    };
};
