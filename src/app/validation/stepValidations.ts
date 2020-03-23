import { YesOrNo } from 'common/types/YesOrNo';
import { EgenutbetalingQuestions } from '../søknad/egenutbetaling-step/config';
import { SituasjonStepQuestions } from '../søknad/situasjon-step/config';
import { SøknadFormData } from '../types/SøknadFormData';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const situasjonStepIsValid = (values: SøknadFormData): boolean => {
    return SituasjonStepQuestions.getVisbility(values).areAllQuestionsAnswered();
};

export const egenutbetalingIsValid = (values: SøknadFormData) => {
    return EgenutbetalingQuestions.getVisbility(values).areAllQuestionsAnswered();
};

export const periodeStepIsValid = ({}: SøknadFormData) => {
    return true; // TODO: Spesifisere valideringsregler
};

export const inntektStepIsValid = ({}: SøknadFormData) => {
    return true; // TODO: Spesifisere valideringsregler
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = (): boolean => true;
