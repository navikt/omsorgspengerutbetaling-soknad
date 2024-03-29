import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { SøknadFormField, SøknadFormData } from '../types/SøknadFormData';

const SoknadFormComponents = getTypedFormComponents<SøknadFormField, SøknadFormData, ValidationError>();

export default SoknadFormComponents;
