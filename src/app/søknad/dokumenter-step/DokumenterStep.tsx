import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { useFormikContext } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

const DokumenterStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (values.dokumenter || []).find((a: any) => a.pending === true) !== undefined;
    const totalSize = getTotalSizeOfAttachments(values.dokumenter);

    return (
        <SøknadStep
            id={StepID.DOKUMENTER}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={hasPendingUploads}>
            <FormBlock>
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id="steg.dokumenter.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="steg.dokumenter.info.2" />
                    </p>
                </CounsellorPanel>
            </FormBlock>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            <FormBlock>
                <FormikFileUploader
                    name={SøknadFormField.dokumenter}
                    label={intlHelper(intl, 'steg.dokumenter.vedlegg')}
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={() => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    onUnauthorizedOrForbiddenUpload={() => navigateToLoginPage()}
                    validate={validateDocuments}
                />
            </FormBlock>
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'steg.dokumenter.advarsel.totalstørrelse'} />
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin="m">
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <Box margin="l">
                <UploadedDocumentsList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
            </Box>
        </SøknadStep>
    );
};

export default DokumenterStep;
