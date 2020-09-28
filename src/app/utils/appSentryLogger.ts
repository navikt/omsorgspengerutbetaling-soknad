import getSentryLoggerForApp from '@navikt/sif-common-sentry';

const appSentryLogger = getSentryLoggerForApp('omsorgspengerutbetaling-soknad', ['sykdom-i-familien']);

export default appSentryLogger;
