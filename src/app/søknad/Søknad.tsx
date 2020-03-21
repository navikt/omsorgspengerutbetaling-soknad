import * as React from 'react';
import IkkeMyndigPage from '../components/pages/ikke-myndig-page/IkkeMyndigPage';
import { initialValues } from '../types/SøknadFormData';
import SøknadContent from './SøknadContent';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import TypedFormComponents from './typed-form-components/TypedFormComponents';

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
                <TypedFormComponents.FormikWrapper
                    initialValues={initialValues}
                    onSubmit={() => null}
                    renderForm={() => <SøknadContent />}
                />
            );
        }}
    />
);

export default Søknad;
