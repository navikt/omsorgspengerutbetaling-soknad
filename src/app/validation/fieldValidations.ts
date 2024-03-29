import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';

export enum AppFieldValidationErrors {
    'for_mange_dokumenter' = 'validation.for_mange_dokumenter',
    'samlet_storrelse_for_hoy' = 'validation.samlet_storrelse_for_hoy',
}

export const alleDokumenterISøknadenToFieldValidationResult = (
    attachments: Attachment[]
): ValidationResult<ValidationError> => {
    const uploadedAttachments = attachments.filter((attachment) => {
        return attachment ? attachmentHasBeenUploaded(attachment) : false;
    });
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return AppFieldValidationErrors.samlet_storrelse_for_hoy;
    }
    if (uploadedAttachments.length > 100) {
        return AppFieldValidationErrors.for_mange_dokumenter;
    }
    return undefined;
};
