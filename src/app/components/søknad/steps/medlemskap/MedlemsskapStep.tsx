import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd
} from 'app/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import getLenker from '../../../../lenker';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';

const MedlemsskapStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                Medlemskap i folketrygden er nøkkelen til rettigheter fra NAV. Hvis du bor eller jobber i Norge er du
                vanligvis medlem. Du kan lese mer om medlemskap på{' '}
                <Lenke href={getLenker().medlemskap} target="_blank">
                    nav.no
                </Lenke>
                .
            </CounsellorPanel>
            <FormBlock margin="xxl">
                <TypedFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={SøknadFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    info={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                />
            </FormBlock>
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dateToday}
                        validate={validateUtenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: 'Legg til nytt utenlandsopphold',
                            modalTitle: 'Utenlandsopphold siste 12 måneder'
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={SøknadFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    info={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        minDate={dateToday}
                        maxDate={date1YearFromNow}
                        name={SøknadFormField.utenlandsoppholdNeste12Mnd}
                        validate={validateUtenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: 'Legg til nytt utenlandsopphold',
                            modalTitle: 'Utenlandsopphold neste 12 måneder'
                        }}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
