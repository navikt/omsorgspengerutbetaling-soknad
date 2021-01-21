import * as React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import './unavailablePage.less';
import { FormattedMessage } from 'react-intl';

const bem = bemUtils('introPage');

const UnavailablePage: React.FunctionComponent = () => {
    const title = 'Søknad om utbetaling av omsorgspenger';
    return (
        <Page className={bem.block} title={title} topContentRenderer={() => <StepBanner text={title} />}>
            <Box margin="xxxl">
                <AlertStripeAdvarsel>
                    <p>
                        <FormattedMessage id="page.unavailable.1" />
                    </p>
                    <p>
                        <FormattedMessage id="page.unavailable.2" />
                    </p>
                </AlertStripeAdvarsel>
            </Box>
        </Page>
    );
};

export default UnavailablePage;
