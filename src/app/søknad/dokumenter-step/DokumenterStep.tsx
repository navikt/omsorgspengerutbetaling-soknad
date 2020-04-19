import * as React from 'react';
import {useIntl} from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {useFormikContext} from 'formik';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import intlHelper from 'common/utils/intlUtils';
import FileUploadErrors from '../../components/file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import PictureScanningGuide from '../../components/picture-scanning-guide/PictureScanningGuide';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import {StepConfigProps, StepID} from '../../config/stepConfig';
import {navigateToLoginPage} from '../../utils/navigationUtils';
import {validateDocuments} from '../../validation/fieldValidations';
import {SøknadFormData, SøknadFormField} from "../../types/SøknadFormData";
import SøknadStep from "../SøknadStep";
import CounsellorPanel from "common/components/counsellor-panel/CounsellorPanel";

const DokumenterStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (values.dokumenter || []).find((a: any) => a.pending === true) !== undefined;

    return (
        <SøknadStep
            id={StepID.DOKUMENTER}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={hasPendingUploads}
        >

            <FormBlock>
                <CounsellorPanel>
                    B: Skal denne være her? Og i så fall, hva skal det stå her?
                </CounsellorPanel>
            </FormBlock>

            <FormBlock>
                <HelperTextPanel>
                    <PictureScanningGuide />
                </HelperTextPanel>
            </FormBlock>
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
