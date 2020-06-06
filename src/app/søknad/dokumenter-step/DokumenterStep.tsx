import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { useFormikContext } from 'formik';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
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
            buttonDisabled={hasPendingUploads}>
            <FormBlock>
                <CounsellorPanel>
                    <p>
                        Du må laste opp en bekreftelse fra lege om at det er særlige smittevernhensyn som gjør at barnet
                        ikke kan gå i barnehage eller skole.
                    </p>
                    <p>
                        Hvis du ikke har bekreftelsen tilgjengelig nå, må du ettersende den til oss så snart du har den.
                        Vi kan ikke behandle søknaden før vi har mottatt bekreftelsen.
                    </p>
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
