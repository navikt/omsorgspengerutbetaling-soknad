import * as React from 'react';
import { useIntl } from 'react-intl';
import {
    validateRequiredList, validateYesOrNoIsAnswered
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { FieldArray, useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';
import DagerMedDelvisFraværList from './components/DagerMedDelvisFraværList';
import PeriodeMedFulltFraværList from './components/PerioderMedFulltFraværList';
import './periodeStep.less';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const {
        perioderMedFravær,
        dagerMedDelvisFravær,
        harPerioderMedFravær,
        harDagerMedDelvisFravær,
        perioder_harVærtIUtlandet
    } = values;
    const intl = useIntl();

    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;

    const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
        const cleanedValues = { ...valuesToBeCleaned };
        if (harDagerMedDelvisFravær === YesOrNo.NO) {
            cleanedValues.dagerMedDelvisFravær = [];
        }
        if (harPerioderMedFravær === YesOrNo.NO) {
            cleanedValues.perioderMedFravær = [];
        }
        return cleanedValues;
    };

    return (
        <FormikStep
            id={StepID.PERIODE}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={kanIkkeFortsette === false}>
            <FormBlock>
                <TypedFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harPerioderMedFravær}
                    legend="Søker du om dager med fullt fravær?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED FULLT FRAVÆR*/}
            {harPerioderMedFravær === YesOrNo.YES && (
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
            {harDagerMedDelvisFravær === YesOrNo.YES && (
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

            {kanIkkeFortsette && (
                <FormBlock margin="xxl">
                    <CounsellorPanel>Du må velge noen dager</CounsellorPanel>
                </FormBlock>
            )}

            {kanIkkeFortsette === false && (
                <>
                    <FormBlock margin={'xl'}>
                        <TypedFormComponents.YesOrNoQuestion
                            name={SøknadFormField.perioder_harVærtIUtlandet}
                            legend={intlHelper(
                                intl,
                                'step.periode.har_dy_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                            )}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {perioder_harVærtIUtlandet === YesOrNo.YES && (
                        <FormBlock margin="l">
                            <BostedUtlandListAndDialog<SøknadFormField>
                                name={SøknadFormField.perioder_utenlandsopphold}
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
                </>
            )}
        </FormikStep>
    );
};

export default PeriodeStep;
