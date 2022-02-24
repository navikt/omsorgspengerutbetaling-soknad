import { Søkerdata } from '../types/Søkerdata';
import * as React from 'react';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';
import { BarnResultType } from '../api/api';

const Søknad: React.FC = () => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(søkerdata: Søkerdata, barn: BarnResultType, formData: SøknadFormData): JSX.Element => {
            return (
                <SøknadFormComponents.FormikWrapper
                    initialValues={formData || initialValues}
                    onSubmit={() => null}
                    renderForm={() => <SøknadRoutes søker={søkerdata.person} barn={barn.barn} />}
                />
            );
        }}
    />
);

export default Søknad;
