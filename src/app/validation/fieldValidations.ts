import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';

export enum AppFieldValidationErrors {
    'ikke_lørdag_eller_søndag_periode' = 'fieldvalidation.saturday_and_sunday_not_possible_periode',
    'ikke_lørdag_eller_søndag_dag' = 'fieldvalidation.saturday_and_sunday_not_possible_dag',
    'for_mange_dokumenter' = 'validation.for_mange_dokumenter',
    'samlet_storrelse_for_hoy' = 'validation.samlet_storrelse_for_hoy',
}

export const validateDocuments = (attachments: Attachment[]): ValidationResult<string> => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(attachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return AppFieldValidationErrors.samlet_storrelse_for_hoy;
    }
    if (uploadedAttachments.length > 100) {
        return AppFieldValidationErrors.for_mange_dokumenter;
    }
    return undefined;
};
