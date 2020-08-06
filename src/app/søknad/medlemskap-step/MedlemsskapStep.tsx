import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    validateUtenlandsoppholdNeste12Mnd,
    validateUtenlandsoppholdSiste12Mnd
} from 'app/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import getLenker from '../../lenker';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';

const MedlemsskapStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    return (
        <SøknadStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedMessage id="steg.medlemsskap.info.1" />
                <Lenke href={getLenker().medlemskap} target="_blank">
                    <FormattedMessage id="steg.medlemsskap.info.2" />
                </Lenke>
                .
            </CounsellorPanel>
            <FormBlock margin="xxl">
                <SøknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={SøknadFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={validateYesOrNoIsAnswered}
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
                        validate={validateUtenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel')
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={SøknadFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
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
                        validate={validateUtenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.listeTittel')
                        }}
                    />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default MedlemsskapStep;
