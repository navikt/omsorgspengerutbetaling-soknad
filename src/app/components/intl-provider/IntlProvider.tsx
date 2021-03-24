import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import bostedUtlandMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import fosterbarnMessages from '@navikt/sif-common-forms/lib/fosterbarn/fosterbarnMessages';
import fraværMessages from '@navikt/sif-common-forms/lib/fravær/fraværMessages';
import virksomhetMessages from '@navikt/sif-common-forms/lib/virksomhet/virksomhetMessages';
import dayjs from 'dayjs';

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

require('dayjs/locale/nb');
require('dayjs/locale/nn');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...bostedUtlandMessages.nb,
    ...fraværMessages.nb,
    ...fosterbarnMessages.nb,
    ...virksomhetMessages.nb,
    ...appBokmålstekster,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...bostedUtlandMessages.nn,
    ...fraværMessages.nn,
    ...fosterbarnMessages.nn,
    ...virksomhetMessages.nn,
    ...appNynorsktekster,
};

export interface IntlProviderProps {
    locale: Locale;
    onError?: (err: any) => void;
}

const showMessages = false;

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, children, onError }) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    dayjs.locale(locale === 'nb' ? 'nb' : 'nn');
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
            {showMessages && (
                <MessagesPreview
                    title="Søknad pleiepenger"
                    showMissingTextSummary={false}
                    messages={{
                        nb: bokmålstekster,
                        nn: nynorsktekster,
                    }}
                />
            )}
        </Provider>
    );
};

export default IntlProvider;
