import * as React from 'react';
import AttachmentListWithDeletion from '@navikt/sif-common-core/lib/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    containsAnyUploadedAttachments,
    fileExtensionIsValid,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import { useFormikContext } from 'formik';
import { deleteFile } from '../../api/api';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';

interface Props {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const UploadedStengtDocumentsList = ({ includeDeletionFunctionality }: Props) => {
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const dokumenter: Attachment[] = values.dokumenterStengtBkgSkole.filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(dokumenter)) {
        return null;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={dokumenter}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(SøknadFormField.dokumenterStengtBkgSkole, dokumenter);
                    if (attachment.url) {
                        deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(
                                    SøknadFormField.dokumenterStengtBkgSkole,
                                    removeElementFromArray(attachment, dokumenter)
                                );
                            },
                            () => {
                                setFieldValue(
                                    SøknadFormField.dokumenterStengtBkgSkole,
                                    removeElementFromArray(attachment, dokumenter)
                                );
                            }
                        );
                    }
                }}
            />
        );
    } else {
        return <AttachmentList attachments={dokumenter} />;
    }
};

export default UploadedStengtDocumentsList;
