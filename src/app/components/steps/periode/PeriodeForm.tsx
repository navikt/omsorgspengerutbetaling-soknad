import * as React from 'react';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import dateRangeValidation from 'common/validation/dateRangeValidation';
import { FormattedMessage, useIntl } from 'react-intl';
import { Systemtittel } from 'nav-frontend-typografi';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import { FormikErrors, FormikProps } from 'formik';
import { getTypedFormComponents } from 'common/formik';

interface Props {
    minDate: Date;
    maxDate: Date;
    periode?: Periode;
    onSubmit: (values: Periode) => void;
    onCancel: () => void;
}


export interface Periode {
    fom: Date;
    tom: Date;
}

export const isValidPeriode = (partialPeriode: Partial<Periode>): partialPeriode is Periode => {
    const { fom, tom } = partialPeriode;
    return fom !== undefined && tom !== undefined;
};

enum PeriodeFormFields {
    fom = 'fom',
    tom = 'tom'
}

type FormValues = Partial<Periode>;

const Form = getTypedFormComponents<PeriodeFormFields, FormValues>();

const PeriodeForm: React.FC<Props> = ({ maxDate, minDate, periode, onSubmit, onCancel }) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: Partial<Periode>) => {
        if (isValidPeriode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FraværPeriodeForm: Formvalues is not a valid FraværPeriode on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={periode || {}}
            onSubmit={onFormikSubmit}
            renderForm={(formik: FormikProps<FormValues>) => {
                const { values } = formik;
                return (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error: FormikErrors<FormValues>) => commonFieldErrorRenderer(intl, error)}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">
                                <FormattedMessage id="periodeform.form.tittel" />
                            </Systemtittel>
                        </Box>

                        <Box padBottom="l">
                            <Form.DateIntervalPicker
                                legend={intlHelper(intl, 'periodeform.form.tidsperiode.spm')}
                                fromDatepickerProps={{
                                    name: PeriodeFormFields.fom,
                                    label: intlHelper(intl, 'periodeform.form.tidsperiode.fraDato'),
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate,
                                        maksDato: values.tom || maxDate
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, values.tom)
                                }}
                                toDatepickerProps={{
                                    name: PeriodeFormFields.tom,
                                    label: intlHelper(intl, 'periodeform.form.tidsperiode.tilDato'),
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: values.fom || minDate,
                                        maksDato: maxDate
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(date, minDate, maxDate, values.fom)
                                }}
                            />
                        </Box>
                    </Form.Form>
                );
            }}
        />
    );
};

export default PeriodeForm;
