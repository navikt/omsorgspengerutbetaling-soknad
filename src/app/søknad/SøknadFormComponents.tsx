import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';

const SøknadFormComponents = getTypedFormComponents<SøknadFormField, SøknadFormData>();

export default SøknadFormComponents;
