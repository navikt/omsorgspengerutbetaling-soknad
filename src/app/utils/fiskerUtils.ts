import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../types/SøknadFormData';
import { yesOrNoIsAnswered } from './yesOrNoIsAnswered';

export const fiskerHarBesvartPåBladBSpørsmål = (values: Partial<SøknadFormData>): boolean =>
    values.har_utbetalt_ti_dager === YesOrNo.YES && yesOrNoIsAnswered(values.fisker_på_blad_B);
