import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import RouteConfig, { getRouteUrl } from '../../../config/routeConfig';

const bem = bemUtils('introPage');

enum PageFormField {
    'erSelvstendigEllerFrilanser' = 'erSelvstendigEllerFrilanser'
}

interface PageFormValues {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo;
}

const initialValues = {};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.StatelessComponent = () => {
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            {/*topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>*/}
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        Når du er selvstendig næringsdrivende eller frilanser kan du søke om utbetaling av
                        omsorgspenger. Som selvstendig næringsdrivende eller frilanser må du som hovedregel dekke de 3
                        første dagene selv. Du kan søke om utbetaling av omsorgspenger fra den 4. dagen du er hjemme med
                        omsorgsdager.
                    </p>
                    <p>
                        Denne søknaden gjelder kun for selvstendig næringsdrivende og frilansere. Hvis du er
                        arbeidstaker og skal ha utbetalt omsorgspenger må du be arbeidsgiveren din om å sende
                        inntektsmelding til NAV.
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock>
                <PageForm.FormikWrapper
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({ values: { erSelvstendigEllerFrilanser } }) => (
                        <PageForm.Form
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                            includeButtons={false}>
                            <PageForm.YesOrNoQuestion
                                name={PageFormField.erSelvstendigEllerFrilanser}
                                legend="Er du selvstendig næringsdrivende eller frilanser?"
                            />
                            {erSelvstendigEllerFrilanser === YesOrNo.NO && (
                                <Box margin="xl">
                                    <AlertStripeInfo>
                                        <p style={{ marginTop: 0, marginBottom: 0 }}>
                                            Søknaden kan brukes av dem som er selvstendig næringsdrivende eller
                                            frilansere.
                                        </p>
                                    </AlertStripeInfo>
                                </Box>
                            )}
                            {erSelvstendigEllerFrilanser === YesOrNo.YES && (
                                <Box margin="xl" textAlignCenter={true}>
                                    <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                        <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                    </Lenke>
                                </Box>
                            )}
                        </PageForm.Form>
                    )}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
