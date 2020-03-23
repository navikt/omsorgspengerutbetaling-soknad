import { StepID } from '../config/stepConfig';
import { SøknadFormData } from './SøknadFormData';

interface TemporaryStorageMetadata {
    lastStepID: StepID;
}

export interface TemporaryStorage {
    metadata: TemporaryStorageMetadata;
    formData: SøknadFormData;
}
