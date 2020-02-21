import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import Box from 'common/components/box/Box';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { deleteFile } from '../../api/api';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';

interface SamværsavtaleAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = SamværsavtaleAttachmentListProps & ConnectedFormikProps<AppFormField>;

const SamværsavtaleAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const avtale: Attachment[] = values[AppFormField.samværsavtale].filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(avtale)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenSamværsavtaleLastetOpp" />
            </Normaltekst>
        );
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={avtale}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(AppFormField.samværsavtale, avtale);
                    deleteFile(attachment.url!).then(
                        () => {
                            setFieldValue(AppFormField.samværsavtale, removeElementFromArray(attachment, avtale));
                        },
                        () => {
                            setFieldValue(AppFormField.samværsavtale, removeElementFromArray(attachment, avtale));
                        }
                    );
                }}
            />
        );
    } else {
        return <AttachmentList attachments={avtale} />;
    }
};

export default connect<SamværsavtaleAttachmentListProps, AppFormField>(SamværsavtaleAttachmentList);
