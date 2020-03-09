import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import { initialValues, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import OmsorgspengesøknadContent from '../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';

const Omsorgspengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }
            return (
                <TypedFormikWrapper<OmsorgspengesøknadFormData>
                    initialValues={initialValues}
                    onSubmit={() => null}
                    renderForm={() => <OmsorgspengesøknadContent />}
                />
            );
        }}
    />
);

export default Omsorgspengesøknad;
