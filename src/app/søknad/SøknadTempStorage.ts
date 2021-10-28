import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import { axiosJsonConfig } from '../config/axiosConfig';
import { StepID } from '../config/stepConfig';
import { ResourceType } from '../types/ResourceType';
import { SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import { getApiUrlByResourceType } from '../utils/apiUtils';

export const STORAGE_VERSION = '10.0';

interface SøknadPersistenceInterface extends Omit<PersistenceInterface<TemporaryStorage>, 'update'> {
    update: (formData: SøknadFormData | undefined, lastStepID: StepID) => Promise<AxiosResponse>;
}

const persistSetup = persistence<TemporaryStorage>({
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    requestConfig: { ...axiosJsonConfig },
});

const SøknadTempStorage: SøknadPersistenceInterface = {
    create: () => {
        return persistSetup.create();
    },
    update: (formData: SøknadFormData, lastStepID: StepID) => {
        return persistSetup.update({ formData, metadata: { lastStepID, version: STORAGE_VERSION } });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default SøknadTempStorage;
