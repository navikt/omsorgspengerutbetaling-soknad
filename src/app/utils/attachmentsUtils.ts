import { SøknadFormData } from '../types/SøknadFormData';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { attachmentHasBeenUploaded } from '@navikt/sif-common-core/lib/utils/attachmentUtils';

export const valuesToAlleDokumenterISøknaden = (values: SøknadFormData): Attachment[] => [
    ...values.dokumenterSmittevernhensyn,
    ...values.dokumenterStengtBkgSkole,
    ...values.dokumenterLegeerklæring,
];

export const getUploadedAttachments = (attachments: Attachment[]): Attachment[] =>
    attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
