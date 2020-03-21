import * as React from 'react';
import IkkeMyndigPage from '../components/pages/ikke-myndig-page/IkkeMyndigPage';
import { initialValues } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';

const Søknad = () => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }
            return (
                <SøknadFormComponents.FormikWrapper
                    initialValues={initialValues}
                    onSubmit={() => null}
                    renderForm={() => <SøknadRoutes />}
                />
            );
        }}
    />
);

export default Søknad;
