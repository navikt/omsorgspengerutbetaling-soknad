import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import { initialValues, SøknadFormData } from '../../types/SøknadFormData';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import SøknadContent from './SøknadContent';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';

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
                <TypedFormikWrapper<SøknadFormData>
                    initialValues={initialValues}
                    onSubmit={() => null}
                    renderForm={() => <SøknadContent />}
                />
            );
        }}
    />
);

export default Søknad;
