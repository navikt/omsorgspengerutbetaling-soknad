import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import FormSection from '../../components/form-section/FormSection';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getUtbetalingsdatoerFraFravær } from '../../utils/fraværUtils';
import SøknadStep from '../SøknadStep';
import { Aktivitet } from '../../types/AktivitetFravær';
import dayjs from 'dayjs';
import SøknadFormComponents from '../SøknadFormComponents';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';

const FraværFraStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const {
        values: { fraværDager, fraværPerioder },
    } = useFormikContext<SøknadFormData>();

    const getFieldName = (date: Date): string => {
        const key = dateToISOString(date);
        const fieldName = `${key}_fraværFra`;
        return fieldName;
    };
    const utbetalingsdatoer = getUtbetalingsdatoerFraFravær(fraværPerioder, fraværDager);
    const cleanupStep = (formData: SøknadFormData): SøknadFormData => {
        formData.aktivitetFravær = [];
        utbetalingsdatoer.forEach((d) => {
            const fieldName = getFieldName(d);
            formData.aktivitetFravær.push({
                dato: d,
                aktivitet: formData[fieldName],
            });
        });
        Object.keys(formData).forEach((key: string) => {
            if (key.indexOf('_fraværFra') === 10) {
                if (utbetalingsdatoer.findIndex((d) => getFieldName(d) === key) === -1) {
                    console.log(`Deleting ${key}`);
                    delete formData[key];
                }
            }
        });
        return formData;
    };

    return (
        <SøknadStep id={StepID.FRAVÆR_FRA} onValidFormSubmit={onValidSubmit} cleanupStep={cleanupStep}>
            <FormBlock>
                <CounsellorPanel>
                    <FormattedMessage id="steg.fravarFra.intro" />
                </CounsellorPanel>
            </FormBlock>
            <FormSection title="Fravær fra hva da?">
                <p>Du må si hva du hadde fravær fra på de ulike dagene du søker om</p>
                <FormBlock>
                    {utbetalingsdatoer.map((date) => {
                        const fieldName = getFieldName(date);
                        return (
                            <FormBlock key={fieldName}>
                                <SøknadFormComponents.RadioGroup
                                    name={fieldName as SøknadFormField}
                                    legend={
                                        <span>
                                            Hva hadde du fravær fra {`${dayjs(date).format('dddd D. MMM YYYY')}`}?
                                        </span>
                                    }
                                    radios={[
                                        {
                                            label: 'Frilanser',
                                            value: Aktivitet.FRILANSER,
                                        },
                                        {
                                            label: 'Selvstendig næringsdrivende',
                                            value: Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE,
                                        },
                                        {
                                            label: 'Både frilanser og selvstendig næringsdrivende',
                                            value: 'begge',
                                        },
                                    ]}
                                    validate={validateRequiredField}
                                />
                            </FormBlock>
                        );
                    })}
                </FormBlock>
            </FormSection>
        </SøknadStep>
    );
};

export default FraværFraStep;
