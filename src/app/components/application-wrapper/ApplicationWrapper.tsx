import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LanguageToggle from '@navikt/sif-common-core/lib/components/language-toggle/LanguageToggle';
import ApplicationMessages from '@navikt/sif-common-core/lib/dev-utils/intl/application-messages/ApplicationMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Søkerdata } from '../../types/Søkerdata';
import { getEnvironmentVariable } from '../../utils/envUtils';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import IntlProvider, { appBokmålstekster, appNynorsktekster } from '../intl-provider/IntlProvider';

interface Props {
    søkerdata?: Søkerdata;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const ApplicationWrapper: React.FunctionComponent<Props> = ({ locale, onChangeLocale, children }) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                {isFeatureEnabled(Feature.NYNORSK) && <LanguageToggle locale={locale} toggle={onChangeLocale} />}
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>
                    {children}
                    <ApplicationMessages
                        messages={{
                            nb: appBokmålstekster,
                            nn: appNynorsktekster,
                        }}
                        title="Omsorgspengerutbetaling SN/frilanser"
                    />
                </Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
