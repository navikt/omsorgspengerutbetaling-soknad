import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/polyfill';
import bostedUtlandMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import fraværMessages from '@navikt/sif-common-forms/lib/fravær/fraværMessages';
import MessagesPreview from 'common/dev-utils/intl/messages-preview/MessagesPreview';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...bostedUtlandMessages.nb,
    ...fraværMessages.nb,
    ...appBokmålstekster
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...bostedUtlandMessages.nn,
    ...fraværMessages.nn,
    ...appNynorsktekster
};

export interface IntlProviderProps {
    locale: Locale;
}

export interface IntlProviderProps {
    locale: Locale;
    onError?: (err: any) => void;
}

const showMessages = false;

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, children, onError }) => {
    const messages = bokmålstekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
            {showMessages && (
                <MessagesPreview
                    title="Søknad pleiepenger"
                    showMissingTextSummary={false}
                    messages={{
                        nb: bokmålstekster,
                        nn: nynorsktekster
                    }}
                />
            )}
        </Provider>
    );
};

export default IntlProvider;
