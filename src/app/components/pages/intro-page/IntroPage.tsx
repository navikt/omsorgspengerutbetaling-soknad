import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
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
    'erSelvstendigEllerFrilanser' = 'erSelvstendigEllerFrilanser',
    'hovedgrunn' = 'hovedgrunn'
}

enum HovedgrunnTilHjemme {
    'permitert' = 'permitert',
    'mistetOppdrag' = 'mistetOppdrag',
    'stengeBedrift' = 'stengeBedrift',
    'skoleBhgStengt' = 'skoleBhgStengt',
    'syktBarn' = 'syktBarn'
}

interface PageFormValues {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo;
    [PageFormField.hovedgrunn]: HovedgrunnTilHjemme;
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
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        Som selvstendig næringsdrivende eller frilanser må du som hovedregel dekke de 3 første dagene
                        selv. Du kan søke om utbetaling av omsorgspenger fra den 4. dagen du er hjemme med omsorgsdager.
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock>
                <PageForm.FormikWrapper
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({ values: { erSelvstendigEllerFrilanser, hovedgrunn } }) => {
                        const harGyldigHovedgrunn =
                            hovedgrunn === HovedgrunnTilHjemme.syktBarn ||
                            hovedgrunn === HovedgrunnTilHjemme.skoleBhgStengt;
                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}>
                                <FormBlock>
                                    <PageForm.YesOrNoQuestion
                                        name={PageFormField.erSelvstendigEllerFrilanser}
                                        legend="Er du selvstendig næringsdrivende eller frilanser?"
                                    />
                                </FormBlock>
                                {erSelvstendigEllerFrilanser === YesOrNo.YES && (
                                    <>
                                        <FormBlock>
                                            <PageForm.RadioPanelGroup
                                                name={PageFormField.hovedgrunn}
                                                legend="Hva er hovedgrunnen til at du er hjemme?"
                                                radios={[
                                                    {
                                                        label: 'Jeg er permittert',
                                                        value: HovedgrunnTilHjemme.permitert
                                                    },
                                                    {
                                                        label: 'Jeg har mistet oppdrag',
                                                        value: HovedgrunnTilHjemme.mistetOppdrag
                                                    },
                                                    {
                                                        label: 'Jeg har måttet stenge bedriften min',
                                                        value: HovedgrunnTilHjemme.stengeBedrift
                                                    },
                                                    {
                                                        label:
                                                            'Jeg kan ikke jobbe fordi jeg må ta meg av barn fordi skolen/bhg har stengt',
                                                        value: HovedgrunnTilHjemme.skoleBhgStengt
                                                    },
                                                    {
                                                        label:
                                                            'Jeg kan ikke jobbe fordi jeg må ta meg av barn fordi barnet er sykt eller barnepasseren er syk',
                                                        value: HovedgrunnTilHjemme.syktBarn
                                                    }
                                                ]}
                                            />
                                        </FormBlock>
                                        {hovedgrunn !== undefined && harGyldigHovedgrunn && (
                                            <Box margin="xl" textAlignCenter={true}>
                                                <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                                    <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                                </Lenke>
                                            </Box>
                                        )}
                                        {hovedgrunn !== undefined && harGyldigHovedgrunn === false && (
                                            <Box margin="xl">
                                                <AlertStripeAdvarsel>
                                                    <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                        [TODO]: du må få beskjed om at det ikke er riktig å søke
                                                        omsorgspenger og du risikere å få avslag. Vi kan henvise til:
                                                        <Lenke href="https://www.nav.no/no/person/innhold-til-person-forside/nyttig-a-vite/koronavirus--informasjon-fra-nav/koronavirus-informasjon-til-selvstendig-naeringsdrivende-og-frilansere">
                                                            Du kan lese mer om dette her
                                                        </Lenke>
                                                    </p>
                                                </AlertStripeAdvarsel>
                                            </Box>
                                        )}
                                    </>
                                )}
                                {erSelvstendigEllerFrilanser === YesOrNo.NO && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                Denne søknaden gjelder <strong>kun</strong> for selvstendig
                                                næringsdrivende og frilansere som skal søke om utbetaling av
                                                omsorgspenger.
                                            </p>
                                            <p>
                                                Hvis du er arbeidstaker, skal du ikke søke om utbetaling av
                                                omsorgspenger. Arbeidsgiveren din skal utbetale deg lønn som vanlig de
                                                dagene du tar ut omsorgsdager.
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}
                            </PageForm.Form>
                        );
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
