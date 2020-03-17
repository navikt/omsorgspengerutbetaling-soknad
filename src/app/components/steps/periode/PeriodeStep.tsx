import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import Box from 'common/components/box/Box';
import { FormikDateIntervalPicker, FormikYesOrNoQuestion } from 'common/formik';
import { Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import intlHelper from 'common/utils/intlUtils';
import { date3YearsAgo } from 'common/utils/dateUtils';
import LabelWithInfo from 'common/formik/components/helpers/label-with-info/LabelWithInfo';

const PeriodeStep = (stepConfigProps: StepConfigProps) => {
    const {
        formValues,
        onValidSubmit
    }: { onValidSubmit: () => void; formValues: OmsorgspengesøknadFormData } = stepConfigProps;

    const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: PERIODE</CounsellorPanel>

            {/* FOR PERIODER */}
            <FieldArray
                name={AppFormField.perioderMedFravær}
                render={(arrayHelpers) => {
                    return (
                        <FormBlock>
                            <Box>Perioder</Box>
                            <span>-----------------</span>
                            <Box>
                                {formValues[AppFormField.perioderMedFravær] &&
                                formValues[AppFormField.perioderMedFravær].length > 0 ? (
                                    <div>
                                        {formValues[AppFormField.perioderMedFravær].map(
                                            (periode: Periode, index: number) => {
                                                return (
                                                    <div key={index}>
                                                        <FormikDateIntervalPicker
                                                            legend={'THE LEGEND'}
                                                            key={`THE_KEY_MASTER${index}`}
                                                            info={'TODO: Write info...?'}
                                                            fromDatepickerProps={{
                                                                label: intlHelper(intl, 'todo.label'),
                                                                validate: () => null,
                                                                name: `${AppFormField.perioderMedFravær}.${index}.fom`,
                                                                dateLimitations: {
                                                                    minDato: date3YearsAgo,
                                                                    maksDato: undefined
                                                                }
                                                            }}
                                                            toDatepickerProps={{
                                                                label: intlHelper(intl, 'todo.label'),
                                                                validate: () => null,
                                                                name: `${AppFormField.perioderMedFravær}.${index}.tom`,
                                                                dateLimitations: {
                                                                    minDato: date3YearsAgo
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        )}
                                        <span> </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                arrayHelpers.insert(formValues[AppFormField.perioderMedFravær].length, {
                                                    fom: undefined,
                                                    tom: undefined
                                                })
                                            }>
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => arrayHelpers.push('')}>
                                        {/* show this when user has removed all elements from the list */}
                                        Add an element
                                    </button>
                                )}
                            </Box>
                        </FormBlock>
                    );
                }}
            />

            {/*<FormBlock margin={'xxl'}>*/}
            {/*    <Box padBottom="l">*/}
            {/*        <LabelWithInfo info={<FormattedMessage id="step.periode.dager_med_fullt_fravært.info" />}>*/}
            {/*            <FormattedMessage id="step.periode.dager_med_fullt_fravært.label" />*/}
            {/*        </LabelWithInfo>*/}
            {/*    </Box>*/}

            {/*    <PeriodeListAndDialog<AppFormField>*/}
            {/*        name={AppFormField.perioderMedFravær}*/}
            {/*        minDate={date1YearAgo}*/}
            {/*        maxDate={dateToday}*/}
            {/*        validate={validatePerioder}*/}
            {/*        labels={{*/}
            {/*            addLabel: 'Legg til ny periode',*/}
            {/*            modalTitle: 'Periode'*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</FormBlock>*/}

            {/*{formValues.perioderMedFravær.map((periode: Periode, index: number) => {*/}
            {/*    return (*/}
            {/*        <FormikDateIntervalPicker<AppFormField>*/}
            {/*            legend={'THE LEGEND'}*/}
            {/*            key={`THE_KEY_MASTER${index}`}*/}
            {/*            info={'TODO: Write info...?'}*/}
            {/*            fromDatepickerProps={{*/}
            {/*                label: intlHelper(intl, 'todo.label'),*/}
            {/*                validate: () => null,*/}
            {/*                name: AppFormField.testing_dato_thingy,*/}
            {/*                dateLimitations: {*/}
            {/*                    minDato: date3YearsAgo,*/}
            {/*                    maksDato: undefined*/}
            {/*                }*/}
            {/*            }}*/}
            {/*            toDatepickerProps={{*/}
            {/*                label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),*/}
            {/*                validate: () => null,*/}
            {/*                name: AppFormField.testing_dato_thingy,*/}
            {/*                dateLimitations: {*/}
            {/*                    minDato: date3YearsAgo*/}
            {/*                }*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    );*/}
            {/*})}*/}

            {/*<FormBlock>*/}
            {/*    <div className={'periode-date-picker-row'}>*/}
            {/*        <div className={'periode-date-picker-element'}>*/}
            {/*            <FormikDatepicker*/}
            {/*                name={AppFormField.testing_dato_thingy}*/}
            {/*                label="Fødselsdato"*/}
            {/*                validate={validateRequiredField}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className={'periode-date-picker-element'}>*/}
            {/*            <FormikDatepicker*/}
            {/*                name={AppFormField.testing_dato_thingy}*/}
            {/*                label="Fødselsdato"*/}
            {/*                validate={validateRequiredField}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</FormBlock>*/}

            {/*<Box margin={'xl'}>*/}
            {/*    asdf*/}
            {/*    <FormikDatepicker id={'TODO_ID'} name={'testing_dato_thingy_feil_name'} label={'Datovelger Label'} />*/}
            {/*</Box>*/}

            <FormBlock margin={'xxl'}>
                <Box padBottom="l">
                    <LabelWithInfo info={<FormattedMessage id="step.periode.dager_med_delvis_fravært.info" />}>
                        <FormattedMessage id="step.periode.dager_med_delvis_fravært.label" />
                    </LabelWithInfo>
                </Box>
            </FormBlock>

            <FormBlock margin={'xxl'}>
                <FormikYesOrNoQuestion
                    name={AppFormField.periode_har_vært_i_utlandet}
                    legend={intlHelper(intl, 'step.periode.har_dy_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                />
            </FormBlock>
        </FormikStep>
    );
};

export default PeriodeStep;
