import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import { navigateToLoginPage } from '../../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../../validation/fieldValidations';
import FileUploadErrors from '../../../file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from './legeerklæring-attachment-list/LegeerklæringAttachmentList';

const LegeerklæringStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (values.legeerklæring || []).find((a) => a.pending === true) !== undefined;

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            buttonDisabled={hasPendingUploads}>
            <HelperTextPanel>
                <FormattedHTMLMessage id="steg.lege.info.html" />
            </HelperTextPanel>
            <Box margin="l">
                <FormikFileUploader
                    name={SøknadFormField.legeerklæring}
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
        </FormikStep>
    );
};

export default LegeerklæringStep;
