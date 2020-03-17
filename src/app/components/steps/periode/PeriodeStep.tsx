import * as React from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import Box from 'common/components/box/Box';
import { FormikDatepicker, FormikYesOrNoQuestion } from 'common/formik';
import { Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import intlHelper from 'common/utils/intlUtils';
import { date3YearsAgo } from 'common/utils/dateUtils';
import LabelWithInfo from 'common/formik/components/helpers/label-with-info/LabelWithInfo';
import DeleteButton from 'common/components/delete-button/DeleteButton';
import './periodeStep.less';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import {Knapp} from "nav-frontend-knapper";

const PeriodeStep = (stepConfigProps: StepConfigProps) => {
    const {
        formValues,
        onValidSubmit
    }: { onValidSubmit: () => void; formValues: OmsorgspengesøknadFormData } = stepConfigProps;

    const intl = useIntl();

    return (
        <FormikStep id={StepID.PERIODE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>TODO: PERIODE</CounsellorPanel>

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
                                                        <div key={index}>
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
                                                                    <DeleteButton
                                                                        ariaLabel={'TODO'}
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                            <Box className={"legg-til-wrapper"}>
                                                <Knapp
                                                    type='standard'
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
                                                    }
                                                >
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
