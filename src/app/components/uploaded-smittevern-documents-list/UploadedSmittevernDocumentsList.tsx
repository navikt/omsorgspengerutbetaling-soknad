import * as React from 'react';
import { useFormikContext } from 'formik';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { deleteFile } from '../../api/api';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';

interface Props {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const UploadedSmittevernDocumentsList: React.FunctionComponent<Props> = ({ includeDeletionFunctionality }) => {
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const dokumenter: Attachment[] = values.dokumenterSmittevernhensyn.filter(({ file }: Attachment) =>
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
                    setFieldValue(SøknadFormField.dokumenterSmittevernhensyn, dokumenter);
                    if (attachment.url) {
                        deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(
                                    SøknadFormField.dokumenterSmittevernhensyn,
                                    removeElementFromArray(attachment, dokumenter)
                                );
                            },
                            () => {
                                setFieldValue(
                                    SøknadFormField.dokumenterSmittevernhensyn,
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

export default UploadedSmittevernDocumentsList;
