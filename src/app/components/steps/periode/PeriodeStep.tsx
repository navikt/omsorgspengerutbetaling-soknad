import * as React from 'react';
import {StepConfigProps, StepID} from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import {AppFormField, OmsorgspengesøknadFormData} from '../../../types/OmsorgspengesøknadFormData';
import {useIntl} from 'react-intl';
import {FieldArray} from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import Box from 'common/components/box/Box';
import {FormikDatepicker, FormikInput, FormikYesOrNoQuestion} from 'common/formik';
import {FraværDelerAvDag, Periode} from '../../../../@types/omsorgspengerutbetaling-schema';
import intlHelper from 'common/utils/intlUtils';
import {date1YearAgo, date3YearsAgo, dateToday} from 'common/utils/dateUtils';
import LabelWithInfo from 'common/formik/components/helpers/label-with-info/LabelWithInfo';
import DeleteButton from 'common/components/delete-button/DeleteButton';
import './periodeStep.less';
import {SkjemaGruppe} from 'nav-frontend-skjema';
import {Knapp} from 'nav-frontend-knapper';
import {YesOrNo} from "common/types/YesOrNo";
import BostedUtlandListAndDialog from "common/forms/bosted-utland/BostedUtlandListAndDialog";

const PeriodeStep = (stepConfigProps: StepConfigProps) => {
    const {
        formValues,
        onValidSubmit
    }: { onValidSubmit: () => void; formValues: OmsorgspengesøknadFormData } = stepConfigProps;

    const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: PERIODE</CounsellorPanel>

            {/* DAGER MED FULLT FRAVÆR*/}
            <FieldArray
                name={AppFormField.perioderMedFravær}
                render={(arrayHelpers) => {
                    return (
                        <FormBlock>
                            <Box>
                                <SkjemaGruppe
                                    legend={
                                        <LabelWithInfo info={'dager med fullt fravær.'}>
                                            Dager med fullt fravær
                                        </LabelWithInfo>
                                    }
                                    className="dateIntervalPicker">
                                    {formValues[AppFormField.perioderMedFravær] &&
                                    formValues[AppFormField.perioderMedFravær].length > 0 ? (
                                        <div>
                                            {formValues[AppFormField.perioderMedFravær].map(
                                                (periode: Periode, index: number) => {
                                                    return (
                                                        <div key={index} className={'periode-row-wrapper'}>
                                                            <div className="dateIntervalPicker__flexContainer">
                                                                <FormikDatepicker
                                                                    label={intlHelper(intl, 'Fra og med')}
                                                                    validate={() => null}
                                                                    name={`${AppFormField.perioderMedFravær}.${index}.fom`}
                                                                    dateLimitations={{
                                                                        minDato: date3YearsAgo,
                                                                        maksDato: undefined
                                                                    }}
                                                                />
                                                                <FormikDatepicker
                                                                    label={intlHelper(intl, 'Til og med')}
                                                                    validate={() => null}
                                                                    name={`${AppFormField.perioderMedFravær}.${index}.tom`}
                                                                    dateLimitations={{
                                                                        minDato: date3YearsAgo
                                                                    }}
                                                                />
                                                                {index > 0 && (
                                                                    <div className={'delete-button-wrapper'}>
                                                                        <DeleteButton
                                                                            ariaLabel={'TODO'}
                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                            <Box className={'legg-til-wrapper'}>
                                                <Knapp
                                                    type="standard"
                                                    htmlType={'button'}
                                                    className={'step__button'}
                                                    aria-label={'TODO: aria-label'}
                                                    onClick={() =>
                                                        arrayHelpers.insert(
                                                            formValues[AppFormField.perioderMedFravær].length,
                                                            {
                                                                fom: undefined,
                                                                tom: undefined
                                                            }
                                                        )
                                                    }>
                                                    Legg til
                                                </Knapp>
                                            </Box>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => arrayHelpers.push('')}>
                                            {/* show this when user has removed all elements from the list */}
                                            Add an element
                                        </button>
                                    )}
                                </SkjemaGruppe>
                            </Box>
                        </FormBlock>
                    );
                }}
            />

            {/* DAGER MED DELVIS FRAVÆR*/}
            <FieldArray
                name={AppFormField.dagerMedDelvisFravær}
                render={(arrayHelpers) => {
                    return (
                        <FormBlock>
                            <Box>
                                <SkjemaGruppe
                                    legend={
                                        <LabelWithInfo info={'dager med fullt fravær.'}>
                                            Dager med delvis fravær
                                        </LabelWithInfo>
                                    }
                                    className="dateIntervalPicker">
                                    {formValues[AppFormField.dagerMedDelvisFravær] &&
                                    formValues[AppFormField.dagerMedDelvisFravær].length > 0 ? (
                                        <div>
                                            {formValues[AppFormField.dagerMedDelvisFravær].map(
                                                (fraværDelerAvDag: FraværDelerAvDag, index: number) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="dateIntervalPicker__flexContainer">
                                                                <FormikDatepicker
                                                                    label={intlHelper(intl, 'Dato')}
                                                                    validate={() => null}
                                                                    name={`${AppFormField.dagerMedDelvisFravær}.${index}.dato`}
                                                                    dateLimitations={{
                                                                        minDato: date3YearsAgo,
                                                                        maksDato: undefined
                                                                    }}
                                                                />
                                                                <FormikInput
                                                                    label={'Timer'}
                                                                    name={`${AppFormField.dagerMedDelvisFravær}.${index}.timer`}
                                                                />

                                                                {index > 0 && (
                                                                    <div className={'delete-button-wrapper'}>
                                                                        <DeleteButton
                                                                            ariaLabel={'TODO'}
                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                            <Box className={'legg-til-wrapper'}>
                                                <Knapp
                                                    type="standard"
                                                    htmlType={'button'}
                                                    className={'step__button'}
                                                    aria-label={'TODO: aria-label'}
                                                    onClick={() =>
                                                        arrayHelpers.insert(
                                                            formValues[AppFormField.dagerMedDelvisFravær].length,
                                                            {
                                                                dato: undefined,
                                                                timer: undefined
                                                            }
                                                        )
                                                    }>
                                                    Legg til
                                                </Knapp>
                                            </Box>
                                        </div>
                                    ) : (
                                        <Box className={'legg-til-wrapper'}>
                                            <Knapp
                                                type="standard"
                                                htmlType={'button'}
                                                className={'step__button'}
                                                aria-label={'TODO: aria-label'}
                                                onClick={() =>
                                                    arrayHelpers.insert(
                                                        formValues[AppFormField.dagerMedDelvisFravær].length,
                                                        {
                                                            dato: undefined,
                                                            timer: undefined
                                                        }
                                                    )
                                                }>
                                                Legg til
                                            </Knapp>
                                        </Box>
                                    )}
                                </SkjemaGruppe>
                            </Box>
                        </FormBlock>
                    );
                }}
            />

            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion
                    name={AppFormField.periode_har_vært_i_utlandet}
                    legend={intlHelper(intl, 'step.periode.har_dy_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                />
            </FormBlock>

            {formValues[AppFormField.periode_har_vært_i_utlandet] === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<AppFormField>
                        name={AppFormField.periode_utenlandsopphold}
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
