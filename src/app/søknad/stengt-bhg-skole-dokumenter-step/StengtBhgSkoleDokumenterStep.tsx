import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import intlHelper from 'common/utils/intlUtils';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import UploadedStengtDocumentsList from '../../components/uploaded-stengt-documents-list/UploadedStengtDocumentsList';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import SøknadStep from '../SøknadStep';
import { valuesToAlleDokumenterISøknaden } from 'app/utils/attachmentsUtils';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

const StengtBhgSkoleDokumenterStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean =
        (values.dokumenterStengtBkgSkole || []).find((a: any) => a.pending === true) !== undefined;

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;
    return (
        <SøknadStep
            id={StepID.DOKUMENTER_STENGT_SKOLE_BHG}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <FormBlock>
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.2" />
                    </p>
                </CounsellorPanel>
            </FormBlock>
            <Box margin="l">
                <PictureScanningGuide />
            </Box>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <FormBlock>
                    <FormikFileUploader
                        name={SøknadFormField.dokumenterStengtBkgSkole}
                        label={intlHelper(intl, 'steg.vedlegg_stengtSkoleBhg.vedlegg')}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        onUnauthorizedOrForbiddenUpload={() => navigateToLoginPage()}
                        validate={validateDocuments}
                    />
                </FormBlock>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin="l">
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.1'} />
                        <Lenke
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            href={
                                'https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-35.01/ettersendelse'
                            }>
                            <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.2'} />
                        </Lenke>
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin="m">
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <Box margin="l">
                <UploadedStengtDocumentsList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
            </Box>
        </SøknadStep>
    );
};

export default StengtBhgSkoleDokumenterStep;
