import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { Aktivitet, AktivitetFravær } from '../../types/AktivitetFravær';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getUtbetalingsdatoerFraFravær } from '../../utils/fraværUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';

const FraværFraStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
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

    const intl = useIntl();

    return (
        <SøknadStep id={StepID.FRAVÆR_FRA} onValidFormSubmit={onValidSubmit} cleanupStep={cleanupStep}>
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
                            <SøknadFormComponents.RadioGroup
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
                                validate={getRequiredFieldValidator({
                                    noValue: () =>
                                        intlHelper(intl, 'appForm.validation.aktivitetFravær.noValue', {
                                            dato,
                                        }),
                                })}
                            />
                        </FormBlock>
                    );
                })}
            </FormBlock>
        </SøknadStep>
    );
};

export default FraværFraStep;
