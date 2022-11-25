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
import { Barn, Person } from '../../types/Søkerdata';
import SøknadTempStorage from '../SoknadTempStorage';
interface Props {
    barn: Barn[];
    søker: Person;
    soknadId: string;
}

const StengtBhgSkoleDokumenterStep: React.FC<Props> = ({ barn, søker, soknadId }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const attachments: Attachment[] = React.useMemo(() => {
        return values ? values[SøknadFormField.dokumenterStengtBkgSkole] : [];
    }, [values]);

    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;
    const ref = React.useRef({ attachments });

    React.useEffect(() => {
        const hasPendingAttachments = attachments.find((a) => a.pending === true);
        if (hasPendingAttachments) {
            return;
        }
        if (attachments.length !== ref.current.attachments.length) {
            const formValues = { ...values, dokumenterLegeerklæring: attachments };
            setFieldValue(SøknadFormField.dokumenterLegeerklæring, attachments);
            SøknadTempStorage.update(soknadId, formValues, StepID.DOKUMENTER_STENGT_SKOLE_BHG, {
                søker,
                barn,
            });
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, soknadId, søker, barn, values]);

    return (
        <SoknadFormStep
            id={StepID.DOKUMENTER_STENGT_SKOLE_BHG}
            includeValidationSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.1" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.2" />{' '}
                        <Lenke href={getLenker(intl.locale).veiledningEttersendelse} target="_blank">
                            <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.3" />
                        </Lenke>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.4" />
                    </Box>
                </CounsellorPanel>

                <FormBlock>
                    <PictureScanningGuide />
                </FormBlock>
                <FormikVedleggsKomponent
                    uploadButtonLabel={intlHelper(intl, 'steg.vedlegg_stengtSkoleBhg.vedlegg')}
                    formikName={SøknadFormField.dokumenterStengtBkgSkole}
                    dokumenter={values.dokumenterStengtBkgSkole}
                    alleDokumenterISøknaden={alleDokumenterISøknaden}
                />
            </FormBlock>
        </SoknadFormStep>
    );
};

export default StengtBhgSkoleDokumenterStep;
