import { FormikProps } from 'formik';
import { OmsorgspengesøknadFormData } from './OmsorgspengesøknadFormData';

export type CustomFormikProps = FormikProps<OmsorgspengesøknadFormData> & { submitForm: () => Promise<void> };
