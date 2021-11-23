import * as React from 'react';
import { initialValues } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';

const Søknad: React.FunctionComponent = () => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(formData) => {
            return (
                <SøknadFormComponents.FormikWrapper
                    initialValues={formData || initialValues}
                    onSubmit={() => null}
                    renderForm={() => <SøknadRoutes />}
                />
            );
        }}
    />
);

export default Søknad;
