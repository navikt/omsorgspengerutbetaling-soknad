import { StepID } from '../søknad/soknadStepsConfig';
import { SøknadFormData } from './SøknadFormData';

export interface SoknadTempStorageData {
    metadata: {
        soknadId: string;
        lastStepID: StepID;
        version: string;
        userHash: string;
    };
    formData: SøknadFormData;
}
