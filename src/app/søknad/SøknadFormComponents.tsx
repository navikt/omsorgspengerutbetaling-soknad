import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';

const SøknadFormComponents = getTypedFormComponents<SøknadFormField, SøknadFormData, ValidationError>();

export default SøknadFormComponents;
