import React from 'react';
import { FormattedMessage } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Aktivitet, AktivitetFravær } from '../../types/AktivitetFravær';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getUtbetalingsdatoerFraFravær } from '../../utils/fraværUtils';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

const FraværFraStep: React.FC = () => {
    const {
        values: { fraværDager, fraværPerioder },
    } = useFormikContext<SøknadFormData>();

    const getFieldName = (dato: Date): string => {
        const key = dateToISOString(dato);
        return `${SøknadFormField.aktivitetFravær}_${key}`;
    };

    const utbetalingsdatoer = getUtbetalingsdatoerFraFravær(fraværPerioder, fraværDager);

    const cleanupStep = (formData: SøknadFormData): SøknadFormData => {
        const aktivitetFravær: AktivitetFravær[] = [];
        utbetalingsdatoer.forEach((d) => {
            const fieldName = getFieldName(d);
            aktivitetFravær.push({
                aktivitet: formData[fieldName],
                dato: d,
            });
        });
        formData.aktivitetFravær = aktivitetFravær;
        return formData;
    };

    return (
        <SoknadFormStep id={StepID.FRAVÆR_FRA} onStepCleanup={cleanupStep}>
            <FormBlock>
                <CounsellorPanel>
                    <FormattedMessage id="step.fravaerFra.info" />
                </CounsellorPanel>
            </FormBlock>

            <FormBlock>
                {utbetalingsdatoer.map((date) => {
                    const fieldName = getFieldName(date);
                    const dato = dayjs(date).format('dddd D. MMM YYYY');
                    return (
                        <FormBlock key={fieldName}>
                            <SoknadFormComponents.RadioGroup
                                name={fieldName as SøknadFormField}
                                legend={<FormattedMessage id="step.fravaerFra.dag.spm" values={{ dato }} />}
                                radios={[
                                    {
                                        label: 'Frilanser',
                                        value: Aktivitet.FRILANSER,
                                    },
                                    {
                                        label: 'Selvstendig næringsdrivende',
                                        value: Aktivitet.SELVSTENDIG_VIRKSOMHET,
                                    },
                                    {
                                        label: 'Både frilanser og selvstendig næringsdrivende',
                                        value: Aktivitet.BEGGE,
                                    },
                                ]}
                                validate={(value) => {
                                    const error = getRequiredFieldValidator()(value);
                                    return error
                                        ? {
                                              key: 'validation.aktivitetFravær.noValue',
                                              values: { dato },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}
                            />
                        </FormBlock>
                    );
                })}
            </FormBlock>
        </SoknadFormStep>
    );
};

export default FraværFraStep;
