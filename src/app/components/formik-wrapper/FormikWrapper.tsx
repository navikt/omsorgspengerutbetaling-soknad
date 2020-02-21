import * as React from 'react';
import { Formik } from 'formik';
import { FormikBag } from '../../types/FormikBag';
import { CustomFormikProps } from '../../types/FormikProps';
import { initialValues, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';

interface FormikWrapperProps {
    contentRenderer: (formikProps: CustomFormikProps) => JSX.Element;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer }) => (
    <Formik
        initialValues={initialValues}
        initialStatus={{ stepSubmitCount: 0, submitCount: 0 }}
        onSubmit={(values: OmsorgspengesøknadFormData, { setSubmitting, setTouched }: FormikBag) => {
            setSubmitting(false);
            setTouched({});
        }}
        render={contentRenderer}
    />
);

export default FormikWrapper;
