import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldArray, useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion, SkjemagruppeQuestion } from 'common/formik';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';
import DagerMedDelvisFraværList from './dager-med-delvis-fravær-list/DagerMedDelvisFraværList';
import PeriodeMedFulltFraværList from './perioder-med-fullt-fravær-list/PerioderMedFulltFraværList';
import './periodeStep.less';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { perioderMedFravær, dagerMedDelvisFravær } = values;
    const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: PERIODE</CounsellorPanel>

            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harPerioderMedFravær}
                    legend="Søker du om dager med fullt fravær?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {/* DAGER MED FULLT FRAVÆR*/}
            {values.harPerioderMedFravær === YesOrNo.YES && (
                <FormBlock margin="l">
                    <SkjemagruppeQuestion
                        legend={perioderMedFravær.length > 0 ? 'Perioder med fullt fravær' : undefined}>
                        <FieldArray
                            name={SøknadFormField.perioderMedFravær}
                            render={(arrayHelpers) => {
                                return (
                                    <PeriodeMedFulltFraværList
                                        perioderMedFravær={perioderMedFravær}
                                        onCreateNew={() =>
                                            arrayHelpers.insert(perioderMedFravær.length, {
                                                fom: undefined,
                                                tom: undefined
                                            })
                                        }
                                        onRemove={(idx) => arrayHelpers.remove(idx)}
                                    />
                                );
                            }}
                        />
                    </SkjemagruppeQuestion>
                </FormBlock>
            )}

            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harDagerMedDelvisFravær}
                    legend="Søker du om dager med delvis fravær?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {/* DAGER MED DELVIS FRAVÆR*/}
            {values.harDagerMedDelvisFravær === YesOrNo.YES && (
                <FormBlock margin="l">
                    <SkjemagruppeQuestion
                        legend={dagerMedDelvisFravær.length > 0 ? 'Dager med delvis fravær' : undefined}>
                        <FieldArray
                            name={SøknadFormField.dagerMedDelvisFravær}
                            render={(arrayHelpers) => {
                                return (
                                    <DagerMedDelvisFraværList
                                        dagerMedDelvisFravær={dagerMedDelvisFravær}
                                        onCreateNew={() =>
                                            arrayHelpers.insert(dagerMedDelvisFravær.length, {
                                                fom: undefined,
                                                tom: undefined
                                            })
                                        }
                                        onRemove={(idx) => arrayHelpers.remove(idx)}
                                    />
                                );
                            }}
                        />
                    </SkjemagruppeQuestion>
                </FormBlock>
            )}

            <FormBlock margin={'xl'}>
                <FormikYesOrNoQuestion
                    name={SøknadFormField.periode_har_vært_i_utlandet}
                    legend={intlHelper(intl, 'step.periode.har_dy_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                />
            </FormBlock>

            {values[SøknadFormField.periode_har_vært_i_utlandet] === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.periode_utenlandsopphold}
                        minDate={date1YearAgo}
                        maxDate={dateToday}
                        validate={undefined}
                        labels={{
                            addLabel: 'Legg til nytt utenlandsopphold',
                            modalTitle: 'Utenlandsopphold siste 12 måneder'
                        }}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default PeriodeStep;
