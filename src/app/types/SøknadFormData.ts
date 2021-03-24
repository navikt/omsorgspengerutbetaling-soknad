import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AndreUtbetalinger } from './AndreUtbetalinger';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // Fravær
    harDekketTiFørsteDagerSelv = 'harDekketTiFørsteDagerSelv',
    harPerioderMedFravær = 'harPerioderMedFravær',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    fraværPerioder = 'fraværPerioder',
    fraværDager = 'fraværDager',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',
    harSøktAndreUtbetalinger = 'harSøktAndreUtbetalinger',
    andreUtbetalinger = 'andreUtbetalinger',

    // Barn
    andreBarn = 'andreBarn',

    // Felter knyttet til stengt bhg eller skole
    dokumenterStengtBkgSkole = 'dokumenterStengtBkgSkole',

    // Optional vedlegg step
    dokumenterSmittevernhensyn = 'dokumenterSmittevernhensyn',

    // Inntekt
    frilans_erFrilanser = 'frilans_erFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    frilans_sluttdato = 'frilans_sluttdato',
    selvstendig_erSelvstendigNæringsdrivende = 'selvstendig_erSelvstendigNæringsdrivende',
    selvstendig_virksomheter = 'selvstendig_virksomheter',

    // Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // Fravær
    [SøknadFormField.harDekketTiFørsteDagerSelv]: YesOrNo;
    [SøknadFormField.harPerioderMedFravær]: YesOrNo;
    [SøknadFormField.fraværPerioder]: FraværPeriode[];
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo;
    [SøknadFormField.fraværDager]: FraværDag[];
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];
    [SøknadFormField.harSøktAndreUtbetalinger]: YesOrNo;
    [SøknadFormField.andreUtbetalinger]: AndreUtbetalinger[];

    [SøknadFormField.dokumenterStengtBkgSkole]: Attachment[];

    // Optional vedlegg step
    [SøknadFormField.dokumenterSmittevernhensyn]: Attachment[];

    // Inntekt
    [SøknadFormField.frilans_erFrilanser]: YesOrNo;
    [SøknadFormField.frilans_startdato]?: string;
    [SøknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SøknadFormField.frilans_sluttdato]?: string;
    [SøknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo;
    [SøknadFormField.selvstendig_virksomheter]?: Virksomhet[];

    // Barn
    [SøknadFormField.andreBarn]: AnnetBarn[];

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

    // Fravær
    [SøknadFormField.harDekketTiFørsteDagerSelv]: YesOrNo.UNANSWERED,
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.fraværPerioder]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.fraværDager]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],
    [SøknadFormField.harSøktAndreUtbetalinger]: YesOrNo.UNANSWERED,
    [SøknadFormField.andreUtbetalinger]: [],

    // Barn
    [SøknadFormField.andreBarn]: [],

    [SøknadFormField.dokumenterStengtBkgSkole]: [],
    [SøknadFormField.dokumenterSmittevernhensyn]: [],

    // Arbeidssituasjon
    [SøknadFormField.frilans_erFrilanser]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],
};
