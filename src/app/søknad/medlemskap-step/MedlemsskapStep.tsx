import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from '@navikt/sif-common-utils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import MedlemskapStepFieldValidations from './medlemskapFieldValidations';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import SoknadFormComponents from '../SoknadFormComponents';

const MedlemsskapStep: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    return (
        <SoknadFormStep id={StepID.MEDLEMSKAP}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="steg.medlemsskap.info.1" />
                    <Lenke href={getLenker().medlemskap} target="_blank">
                        <FormattedMessage id="steg.medlemsskap.info.2" />
                    </Lenke>
                    .
                </p>
            </CounsellorPanel>
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={SøknadFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={MedlemskapStepFieldValidations.harBoddUtenforNorgeSiste12Mnd}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'steg.medlemsskap.hvaBetyrDette')}>
                            {intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dateToday}
                        validate={MedlemskapStepFieldValidations.utenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={SøknadFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={MedlemskapStepFieldValidations.skalBoUtenforNorgeNeste12Mnd}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'steg.medlemsskap.hvaBetyrDette')}>
                            {intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        minDate={dateToday}
                        maxDate={date1YearFromNow}
                        name={SøknadFormField.utenlandsoppholdNeste12Mnd}
                        validate={MedlemskapStepFieldValidations.utenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.listeTittel'),
                        }}
                    />
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default MedlemsskapStep;
