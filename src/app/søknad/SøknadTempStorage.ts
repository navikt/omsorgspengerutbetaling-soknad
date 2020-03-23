import persistence, {
    PersistenceInterface
} from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { StepID } from '../config/stepConfig';
import { ResourceType } from '../types/ResourceType';
import { SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import { getApiUrlByResourceType } from '../utils/apiUtils';

interface SøknadPersistenceInterface extends Omit<PersistenceInterface<TemporaryStorage>, 'persist'> {
    persist: (formData: SøknadFormData, lastStepID: StepID) => Promise<AxiosResponse>;
}

const persistSetup = persistence<TemporaryStorage>({
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    requestConfig: { ...axiosConfig }
});

const SøknadTempStorage: SøknadPersistenceInterface = {
    persist: (formData: SøknadFormData, lastStepID: StepID) => {
        return persistSetup.persist({ formData, metadata: { lastStepID } });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate
};

export default SøknadTempStorage;
