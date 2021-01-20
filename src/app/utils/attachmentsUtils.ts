import { SøknadFormData } from '../types/SøknadFormData';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

export const valuesToAlleDokumenterISøknaden = (values: SøknadFormData): Attachment[] => [
    ...values.dokumenterSmittevernhensyn,
    ...values.dokumenterStengtBkgSkole,
];
