import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedUtlandMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';

const selvstendigMessagesNb = require('../../i18n/selvstendigOgFrilans.nb.json');
const selvstendigMessagesNn = require('../../i18n/selvstendigOgFrilans.nn.json');

const appBokmålstekster = require('../../i18n/nb.json');
const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...selvstendigMessagesNb,
    ...bostedUtlandMessages.nb
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...appNynorsktekster,
    ...selvstendigMessagesNn,
    ...bostedUtlandMessages.nn
};

export interface IntlProviderProps {
    locale: Locale;
}

export interface IntlProviderProps {
    locale: Locale;
    onError?: (err: any) => void;
}

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, children, onError }) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
