import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';

const TypedFormComponents = getTypedFormComponents<SøknadFormField, SøknadFormData>();

export default TypedFormComponents;
