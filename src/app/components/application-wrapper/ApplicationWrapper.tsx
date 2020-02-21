import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
// import LanguageToggle from 'common/components/language-toggle/LanguageToggle';
import { Locale } from 'common/types/Locale';
import { Søkerdata } from '../../types/Søkerdata';
import { appIsRunningInDemoMode, getEnvironmentVariable } from '../../utils/envUtils';
import DemoModeInfo from '../demo-mode-info/DemoModeInfo';
import IntlProvider from '../intl-provider/IntlProvider';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const demoMode = appIsRunningInDemoMode();

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ locale, onChangeLocale, children }) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                {demoMode && <DemoModeInfo />}

                {/* I Påvente av oversettelser */}
                {/* {demoMode === false &&  <LanguageToggle locale={locale} toggle={onChangeLocale} />} */}
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>{children}</Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
