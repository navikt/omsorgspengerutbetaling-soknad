import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import './generalErrorPage.less';

const GeneralErrorPage: React.FunctionComponent = () => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.feilside);
    return (
        <Page title={intlHelper(intl, 'page.generalErrorPage.sidetittel')}>
            <div className={'generalErrorPage'}>
                <Veilederpanel type="plakat" kompakt={true} fargetema="normal" svg={<VeilederSVG mood="uncertain" />}>
                    <Systemtittel tag="h2">
                        <FormattedMessage id="page.generalErrorPage.tittel" />
                    </Systemtittel>
                    <Box margin="m" padBottom="l">
                        <Ingress>
                            <FormattedMessage id="page.generalErrorPage.tekst" />
                        </Ingress>
                    </Box>
                </Veilederpanel>
            </div>
        </Page>
    );
};

export default GeneralErrorPage;
