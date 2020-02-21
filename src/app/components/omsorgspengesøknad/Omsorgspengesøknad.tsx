import * as React from 'react';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import FormikWrapper from '../formik-wrapper/FormikWrapper';
import OmsorgspengesøknadContent from '../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';

const renderOmsorgspengesoknad = () => (
    <FormikWrapper contentRenderer={(formikProps) => <OmsorgspengesøknadContent formikProps={formikProps} />} />
);

const Omsorgspengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }
            return renderOmsorgspengesoknad();
        }}
    />
);

export default Omsorgspengesøknad;
