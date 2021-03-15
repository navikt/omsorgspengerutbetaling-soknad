import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn/types';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { AndreUtbetalinger } from './AndreUtbetalinger';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    førsteDagMedFravær = 'førsteDagMedFravær',
    sisteDagMedFravær = 'sisteDagMedFravær',

    // Periode
    harPerioderMedFravær = 'harPerioderMedFravær',
    fraværPerioder = 'fraværPerioder',
    perioderMedFravær = 'perioderMedFravær',
    perioderMedFraværGroup = 'perioderMedFraværGroup',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    fraværDager = 'fraværDager',
    dagerMedDelvisFravær = 'dagerMedDelvisFravær',
    dagerMedDelvisFraværGroup = 'dagerMedDelvisFraværGroup',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',
    har_søkt_andre_utbetalinger = 'har_søkt_andre_utbetalinger',
    andre_utbetalinger = 'andre_utbetalinger',

    hjemmePgaSmittevernhensyn = 'hjemmePgaSmittevernhensyn',

    // Felter knyttet til stengt bhg eller skole
    hjemmePgaStengtBhgSkole = 'hjemmePgaStengtBhgSkole',
    dokumenterStengtBkgSkole = 'dokumenterStengtBkgSkole',

    // Optional vedlegg step
    dokumenterSmittevernhensyn = 'dokumenterSmittevernhensyn',

    // Conditional perioder i utlandet
    hvis_utenlandsopphold_en_test_verdi = 'hvis_utenlandsopphold_en_test_verdi',

    // Inntekt
    frilans_erFrilanser = 'frilans_erFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    frilans_sluttdato = 'frilans_sluttdato',
    selvstendig_erSelvstendigNæringsdrivende = 'selvstendig_erSelvstendigNæringsdrivende',
    selvstendig_virksomheter = 'selvstendig_virksomheter',
    er_arbeidstaker = 'er_arbeidstaker',

    // Barn
    har_fosterbarn = 'har_fosterbarn',
    fosterbarn = 'fosterbarn',

    // Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    [SøknadFormField.førsteDagMedFravær]?: string;
    [SøknadFormField.sisteDagMedFravær]?: string;

    // Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo;
    [SøknadFormField.perioderMedFravær]: Periode[];
    [SøknadFormField.fraværPerioder]: FraværPeriode[];
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo;
    [SøknadFormField.dagerMedDelvisFravær]: FraværDelerAvDag[];
    [SøknadFormField.fraværDager]: FraværDag[];
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];
    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo;
    [SøknadFormField.andre_utbetalinger]: AndreUtbetalinger[];

    [SøknadFormField.hjemmePgaSmittevernhensyn]: YesOrNo;

    [SøknadFormField.hjemmePgaStengtBhgSkole]: YesOrNo;
    [SøknadFormField.dokumenterStengtBkgSkole]: Attachment[];

    // Optional vedlegg step
    [SøknadFormField.dokumenterSmittevernhensyn]: Attachment[];

    // Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo;

    // Inntekt
    [SøknadFormField.frilans_erFrilanser]: YesOrNo;
    [SøknadFormField.frilans_startdato]?: string;
    [SøknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SøknadFormField.frilans_sluttdato]?: string;
    [SøknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo;
    [SøknadFormField.selvstendig_virksomheter]?: Virksomhet[];
    [SøknadFormField.er_arbeidstaker]: YesOrNo;

    // Barn
    [SøknadFormField.har_fosterbarn]: YesOrNo;
    [SøknadFormField.fosterbarn]: Fosterbarn[];

    // Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}

export type FrilansFormData = Pick<
    SøknadFormData,
    | SøknadFormField.frilans_erFrilanser
    | SøknadFormField.frilans_jobberFortsattSomFrilans
    | SøknadFormField.frilans_startdato
    | SøknadFormField.frilans_sluttdato
>;

export type SelvstendigFormData = Pick<
    SøknadFormData,
    SøknadFormField.selvstendig_erSelvstendigNæringsdrivende | SøknadFormField.selvstendig_virksomheter
>;

export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    [SøknadFormField.førsteDagMedFravær]: undefined,
    [SøknadFormField.sisteDagMedFravær]: undefined,

    // Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderMedFravær]: [],
    [SøknadFormField.fraværPerioder]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.dagerMedDelvisFravær]: [],
    [SøknadFormField.fraværDager]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],
    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo.UNANSWERED,
    [SøknadFormField.andre_utbetalinger]: [],

    [SøknadFormField.hjemmePgaSmittevernhensyn]: YesOrNo.UNANSWERED,

    [SøknadFormField.hjemmePgaStengtBhgSkole]: YesOrNo.UNANSWERED,
    [SøknadFormField.dokumenterStengtBkgSkole]: [],

    // Optional vedlegg step
    [SøknadFormField.dokumenterSmittevernhensyn]: [],

    // Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo.UNANSWERED,

    // Arbeidssituasjon
    [SøknadFormField.frilans_erFrilanser]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [SøknadFormField.er_arbeidstaker]: YesOrNo.UNANSWERED,

    // Kvalifisering
    [SøknadFormField.har_fosterbarn]: YesOrNo.UNANSWERED,
    [SøknadFormField.fosterbarn]: [],

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],
};
