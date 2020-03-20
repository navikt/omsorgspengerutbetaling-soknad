import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const yesOrNoIsAnswered = (answer?: YesOrNo) => answer === YesOrNo.YES || answer === YesOrNo.NO;
