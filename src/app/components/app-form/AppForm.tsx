import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { AppFormField, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';

const AppForm = getTypedFormComponents<AppFormField, OmsorgspengesøknadFormData>();

export default AppForm;
