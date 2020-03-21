import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';

const TypedFormComponents = getTypedFormComponents<SøknadFormField, SøknadFormData>();

export default TypedFormComponents;
