import * as React from 'react';
import { useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd,
    validateYesOrNoIsAnswered
} from 'app/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';

const MedlemsskapStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit, formValues }) => {
    const intl = useIntl();
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
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    info={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                />
            </FormBlock>
            {formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<AppFormField>
                        name={AppFormField.utenlandsoppholdSiste12Mnd}
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
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    info={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
            </FormBlock>
            {formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<AppFormField>
                        minDate={dateToday}
                        maxDate={date1YearFromNow}
                        name={AppFormField.utenlandsoppholdNeste12Mnd}
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
