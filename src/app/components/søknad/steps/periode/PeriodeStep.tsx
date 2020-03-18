import * as React from 'react';
import { useIntl } from 'react-intl';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldArray, useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import DeleteButton from 'common/components/delete-button/DeleteButton';
import FormBlock from 'common/components/form-block/FormBlock';
import {
    FormikDatepicker, FormikInput, FormikYesOrNoQuestion, SkjemagruppeQuestion
} from 'common/formik';
import LabelWithInfo from 'common/formik/components/helpers/label-with-info/LabelWithInfo';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date3YearsAgo, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { FraværDelerAvDag } from '../../../../../@types/omsorgspengerutbetaling-schema';
import { StepConfigProps, StepID } from '../../../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../../../types/SøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import TypedFormComponents from '../../typed-form-components/TypedFormComponents';
import PeriodeMedFulltFraværPart from './perioder-med-fullt-fravær-list/PerioderMedFulltFraværList';
import './periodeStep.less';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const perioderMedFravær = values.perioderMedFravær;
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
                                    <PeriodeMedFulltFraværPart
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
                <FieldArray
                    name={SøknadFormField.dagerMedDelvisFravær}
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
                                        {values[SøknadFormField.dagerMedDelvisFravær] &&
                                        values[SøknadFormField.dagerMedDelvisFravær].length > 0 ? (
                                            <div>
                                                {values[SøknadFormField.dagerMedDelvisFravær].map(
                                                    (fraværDelerAvDag: FraværDelerAvDag, index: number) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className="dateIntervalPicker__flexContainer">
                                                                    <FormikDatepicker
                                                                        label={intlHelper(intl, 'Dato')}
                                                                        validate={() => null}
                                                                        name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.dato`}
                                                                        dateLimitations={{
                                                                            minDato: date3YearsAgo,
                                                                            maksDato: undefined
                                                                        }}
                                                                    />
                                                                    <FormikInput
                                                                        label={'Timer'}
                                                                        name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.timer`}
                                                                    />

                                                                    {index > 0 && (
                                                                        <div className={'delete-button-wrapper'}>
                                                                            <DeleteButton
                                                                                ariaLabel={'TODO'}
                                                                                onClick={() =>
                                                                                    arrayHelpers.remove(index)
                                                                                }
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
                                                                values[SøknadFormField.dagerMedDelvisFravær].length,
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
                                                            values[SøknadFormField.dagerMedDelvisFravær].length,
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
            )}

            <FormBlock margin={'xxl'}>
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
