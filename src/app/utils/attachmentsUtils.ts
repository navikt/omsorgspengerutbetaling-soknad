import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { Attachment } from 'common/types/Attachment';

export const valuesToAlleDokumenterISøknaden = (values: SøknadFormData): Attachment[] => [
    ...values[SøknadFormField.dokumenterSmittevernhensyn],
    ...values[SøknadFormField.dokumenterStengtBkgSkole],
];
