import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { appIsRunningInDemoMode, enableDemoModeUpload } from '../../../utils/envUtils';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';

const LegeerklæringStep = ({ onValidSubmit, formValues }: StepConfigProps) => {
    const intl = useIntl();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const isRunningDemoMode = appIsRunningInDemoMode();
    const showUploadForm = enableDemoModeUpload() === false;
    const hasPendingUploads: boolean = (formValues.legeerklæring || []).find((a) => a.pending === true) !== undefined;

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            skipValidation={isRunningDemoMode}
            buttonDisabled={hasPendingUploads}>
            {!showUploadForm && (
                <Box>
                    <AlertStripeInfo>
                        Opplasting av legeerklæring er ikke tilgjengelig i demo versjon. Du kan klikke Fortsett.
                    </AlertStripeInfo>
                </Box>
            )}
            {showUploadForm && (
                <>
                    <HelperTextPanel>
                        <FormattedHTMLMessage id="steg.lege.info.html" />
                    </HelperTextPanel>
                    <Box margin="l">
                        <FormikFileUploader
                            name={AppFormField.legeerklæring}
                            label={intlHelper(intl, 'steg.lege.vedlegg')}
                            onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                            onFileInputClick={() => {
                                setFilesThatDidntGetUploaded([]);
                            }}
                            validate={validateLegeerklæring}
                            onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                        />
                    </Box>
                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                    <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
                </>
            )}
        </FormikStep>
    );
};

export default LegeerklæringStep;
