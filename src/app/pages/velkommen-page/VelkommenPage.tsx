import React from 'react';
import { useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useSoknadContext } from '../../søknad/SoknadContext';
import VelkommenPageForm from './VelkommenPageForm';
import './welcomingPage.less';
import VelkommenGuide from './components/VelkommenGuide';
import OmSøknaden from './components/OmSøknaden';
import { Person } from '../../types/Søkerdata';

const VelkommenPage = ({ søker }: { søker: Person }) => {
    const intl = useIntl();
    const { startSoknad } = useSoknadContext();
    useLogSidevisning(SIFCommonPageKey.velkommen);

    return (
        <Page title={intlHelper(intl, 'welcomingPage.sidetittel')}>
            <VelkommenGuide navn={søker.fornavn} />
            <OmSøknaden />
            <Box margin="xl">
                <VelkommenPageForm onStart={startSoknad} />
            </Box>
        </Page>
    );
};

export default VelkommenPage;
