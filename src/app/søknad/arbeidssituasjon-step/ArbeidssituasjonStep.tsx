import * as React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { cleanupArbeidssituasjonStep } from './cleanupArbeidssituasjonStep';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendeFormPart';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { Barn, Person } from '../../types/Søkerdata';

const shouldShowSubmitButton = (søknadFormData: SøknadFormData): boolean => {
    const erFrilanser: YesOrNo = søknadFormData[SøknadFormField.frilans_erFrilanser];
    const erSelvstendigNæringsdrivende: YesOrNo | undefined =
        søknadFormData[SøknadFormField.selvstendig_erSelvstendigNæringsdrivende];

    return !(erFrilanser === YesOrNo.NO && erSelvstendigNæringsdrivende === YesOrNo.NO);
};

interface Props {
    barn: Barn[];
    søker: Person;
    soknadId?: string;
}

const ArbeidssituasjonStep: React.FC<Props> = ({ barn, søker, soknadId }: Props) => {
    const { values } = useFormikContext<SøknadFormData>();
    const showSubmitButton = shouldShowSubmitButton(values);

    return (
        <SoknadFormStep
            id={StepID.ARBEIDSSITUASJON}
            showSubmitButton={showSubmitButton}
            onStepCleanup={cleanupArbeidssituasjonStep}>
            <CounsellorPanel>
                <p>
                    <FormattedHtmlMessage id="step.arbeidssituasjon.info.1" />
                </p>
            </CounsellorPanel>

            <Box margin="xxl" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} barn={barn} søker={søker} soknadId={soknadId} />
            </Box>
            {!showSubmitButton && (
                <FormBlock margin="l">
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.arbeidssituasjon.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidssituasjonStep;
