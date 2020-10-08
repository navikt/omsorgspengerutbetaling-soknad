import { SøknadFormData } from '../types/SøknadFormData';
import { Attachment } from 'common/types/Attachment';

export const valuesToAlleDokumenterISøknaden = (values: SøknadFormData): Attachment[] => [
    ...values.dokumenterSmittevernhensyn,
    ...values.dokumenterStengtBkgSkole,
];
