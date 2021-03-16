import * as React from 'react';
import IkkeMyndigPage from '../components/pages/ikke-myndig-page/IkkeMyndigPage';
import { initialValues } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';

const Søknad: React.FunctionComponent = () => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(søkerdata, formData) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }

            return (
                <SøknadFormComponents.FormikWrapper
                    initialValues={formData || initialValues}
                    onSubmit={() => null}
                    renderForm={() => <SøknadRoutes søkerdata={søkerdata} />}
                />
            );
        }}
    />
);

export default Søknad;
