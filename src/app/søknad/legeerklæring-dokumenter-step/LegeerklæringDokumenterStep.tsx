import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentsUtils';
import getLenker from '../../lenker';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';

const LegeerklæringDokumenterStep: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const hasPendingUploads: boolean =
        (values.dokumenterLegeerklæring || []).find((a: any) => a.pending === true) !== undefined;

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);

    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep
            id={StepID.DOKUMENTER_LEGEERKLÆRING}
            includeValidationSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_legeerklæring.counsellorpanel.1" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_legeerklæring.counsellorpanel.2" />{' '}
                        <Lenke href={getLenker(intl.locale).veiledningEttersendelse} target="_blank">
                            <FormattedMessage id="step.vedlegg_legeerklæring.counsellorpanel.3" />
                        </Lenke>
                        {'.'}
                    </Box>
                </CounsellorPanel>
            </FormBlock>
            <FormBlock>
                <PictureScanningGuide />
            </FormBlock>
            <FormikVedleggsKomponent
                uploadButtonLabel={intlHelper(intl, 'step.vedlegg_legeerklæring.uploadBtn')}
                formikName={SøknadFormField.dokumenterLegeerklæring}
                dokumenter={values.dokumenterLegeerklæring}
                alleDokumenterISøknaden={alleDokumenterISøknaden}
            />
        </SoknadFormStep>
    );
};

export default LegeerklæringDokumenterStep;
