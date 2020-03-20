import * as React from 'react';
import { useIntl } from 'react-intl';
import {
    validateRequiredList, validateYesOrNoIsAnswered
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { FieldArray, useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { FraværDelerAvDag, Periode } from '../../../../../@types/omsorgspengerutbetaling-schema';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';
import DagerMedDelvisFraværList from './dager-med-delvis-fravær-list/DagerMedDelvisFraværList';
import PeriodeMedFulltFraværList from './perioder-med-fullt-fravær-list/PerioderMedFulltFraværList';
import './periodeStep.less';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { perioderMedFravær, dagerMedDelvisFravær, harPerioderMedFravær, harDagerMedDelvisFravær } = values;
    const intl = useIntl();

    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;

    console.log(kanIkkeFortsette);

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit} showSubmitButton={kanIkkeFortsette === false}>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harPerioderMedFravær}
                    legend="Søker du om dager med fullt fravær?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {/* DAGER MED FULLT FRAVÆR*/}
            {values.harPerioderMedFravær === YesOrNo.YES && (
                <FormBlock margin={perioderMedFravær.length > 0 ? 'l' : 'none'}>
                    <FieldArray
                        name={SøknadFormField.perioderMedFravær}
                        render={(arrayHelpers) => {
                            return (
                                <PeriodeMedFulltFraværList
                                    perioderMedFravær={perioderMedFravær}
                                    onCreateNew={() => {
                                        const emptyPeriodeMedFravær: Partial<Periode> = {
                                            fom: undefined,
                                            tom: undefined
                                        };

                                        arrayHelpers.insert(perioderMedFravær.length, emptyPeriodeMedFravær);
                                    }}
                                    onRemove={(idx) => arrayHelpers.remove(idx)}
                                />
                            );
                        }}
                    />
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
                <FormBlock margin={dagerMedDelvisFravær.length > 0 ? 'l' : 'none'}>
                    <FieldArray
                        name={SøknadFormField.dagerMedDelvisFravær}
                        render={(arrayHelpers) => {
                            return (
                                <DagerMedDelvisFraværList
                                    dagerMedDelvisFravær={dagerMedDelvisFravær}
                                    onCreateNew={() => {
                                        const emptyDagMedFravær: Partial<FraværDelerAvDag> = {
                                            dato: undefined,
                                            timer: undefined
                                        };
                                        arrayHelpers.insert(dagerMedDelvisFravær.length, emptyDagMedFravær);
                                    }}
                                    onRemove={(idx) => arrayHelpers.remove(idx)}
                                />
                            );
                        }}
                    />
                </FormBlock>
            )}

            <FormBlock margin={'xl'}>
                <FormikYesOrNoQuestion
                    name={SøknadFormField.periode_har_vært_i_utlandet}
                    legend={intlHelper(intl, 'step.periode.har_dy_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {values[SøknadFormField.periode_har_vært_i_utlandet] === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.periode_utenlandsopphold}
                        minDate={date1YearAgo}
                        maxDate={dateToday}
                        labels={{
                            addLabel: 'Legg til nytt utenlandsopphold',
                            modalTitle: 'Utenlandsopphold siste 12 måneder'
                        }}
                        validate={validateRequiredList}
                    />
                </FormBlock>
            )}

            {kanIkkeFortsette && (
                <FormBlock margin="xxl">
                    <CounsellorPanel>Du må velge noen dager</CounsellorPanel>
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default PeriodeStep;
