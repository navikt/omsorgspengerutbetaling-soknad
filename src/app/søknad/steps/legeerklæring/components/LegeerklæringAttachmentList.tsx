import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { connect, useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { deleteFile } from '../../../../api/api';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';

interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps;

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const legeerklæring: Attachment[] = values.legeerklæring.filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(legeerklæring)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenLegeerklæringLastetOpp" />
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
                attachments={legeerklæring}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(SøknadFormField.legeerklæring, legeerklæring);
                    deleteFile(attachment.url!).then(
                        () => {
                            setFieldValue(
                                SøknadFormField.legeerklæring,
                                removeElementFromArray(attachment, legeerklæring)
                            );
                        },
                        () => {
                            setFieldValue(
                                SøknadFormField.legeerklæring,
                                removeElementFromArray(attachment, legeerklæring)
                            );
                        }
                    );
                }}
            />
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default connect<LegeerklæringAttachmentListProps, SøknadFormField>(LegeerklæringAttachmentList);
