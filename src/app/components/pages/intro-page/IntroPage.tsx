import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
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
import SmittevernInfo from '../../information/SmittevernInfo';

const bem = bemUtils('introPage');

enum PageFormField {
    'erSelvstendigEllerFrilanser' = 'erSelvstendigEllerFrilanser',
    'hjemmePgaStengt' = 'hjemmePgaStengt',
    'hjemmePgaSykdom' = 'hjemmePgaSykdom',
    'smittevernHensyn' = 'smittevernHensyn'
}

interface PageFormValues {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo;
    [PageFormField.hjemmePgaStengt]: YesOrNo;
    [PageFormField.hjemmePgaSykdom]: YesOrNo;
    [PageFormField.smittevernHensyn]: YesOrNo;
}

const initialValues = {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo.UNANSWERED,
    [PageFormField.hjemmePgaStengt]: YesOrNo.UNANSWERED,
    [PageFormField.hjemmePgaSykdom]: YesOrNo.UNANSWERED,
    [PageFormField.smittevernHensyn]: YesOrNo.UNANSWERED
};
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
                        Denne søknaden bruker du når du er <strong>selvstendig næringsdrivende eller frilanser</strong>{' '}
                        og skal søke om utbetaling av omsorgspenger. Hvis du er ansatt i eget AS regnes du som
                        arbeidstaker, da skal du eller din regnskapsfører{' '}
                        <Lenke
                            href="https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding"
                            target="_blank">
                            sende inntektsmelding til NAV
                        </Lenke>
                        .
                    </p>
                    <p>Du kan søke om omsorgspenger når du har vært hjemme fra jobb fordi</p>
                    <ul>
                        <li>
                            barnet ikke kan gå i barnehage eller skole når disse åpnes igjen, på grunn av særlige
                            smittevernhensyn
                        </li>
                        <li>barnehagen eller skolen er stengt på grunn av koronaviruset</li>
                        <li>barnet eller barnepasser er syk</li>
                    </ul>
                    <p>
                        Vær oppmerksom på at om du har søkt om{' '}
                        <Lenke href="https://www.nav.no/arbeid/inntektskompensasjon" target="_blank">
                            kompensasjon for tapt inntekt som selvstendig næringsdrivende og/eller frilanser
                        </Lenke>
                        , kan du ikke søke om omsorgspenger for samme periode.
                    </p>
                    <p>
                        Hvis du har søkt om kompensasjon, men nå ønsker å søke om omsorgspenger, må du trekke din søknad
                        om kompensasjon. Dette gjør du ved å{' '}
                        <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss" target="_blank">
                            skrive en beskjed til oss
                        </Lenke>
                        . Under tema velger du jobbsøker (selv om du ikke er jobbsøker).
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({
                        values: { erSelvstendigEllerFrilanser, hjemmePgaStengt, hjemmePgaSykdom, smittevernHensyn }
                    }) => {
                        const kanBrukeSøknaden =
                            (erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.YES) ||
                            (erSelvstendigEllerFrilanser === YesOrNo.YES &&
                                smittevernHensyn === YesOrNo.NO &&
                                hjemmePgaStengt === YesOrNo.YES) ||
                            (erSelvstendigEllerFrilanser === YesOrNo.YES &&
                                smittevernHensyn === YesOrNo.NO &&
                                hjemmePgaStengt === YesOrNo.NO &&
                                hjemmePgaSykdom === YesOrNo.YES);

                        const skalViseSmittevernSpørsmål = erSelvstendigEllerFrilanser === YesOrNo.YES;

                        const skalViseStengtBarnehageSpørsmål =
                            erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.NO;

                        const skalViseSykBarnepasserSpørsmål =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO;

                        const skalViseSmittevernInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.YES;
                        const skalViseErIkkeFrilansEllerSelvstendigInfo = erSelvstendigEllerFrilanser === YesOrNo.NO;
                        const skalViseKanIkkeBrukeSøknadenInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO &&
                            hjemmePgaSykdom === YesOrNo.NO;

                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}>
                                <PageForm.YesOrNoQuestion
                                    name={PageFormField.erSelvstendigEllerFrilanser}
                                    legend="Er du selvstendig næringsdrivende eller frilanser?"
                                />

                                {skalViseSmittevernSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.smittevernHensyn}
                                            legend="Har du vært hjemme med barn på grunn av særlige smittevernhensyn?"
                                            info={<SmittevernInfo />}
                                        />
                                    </FormBlock>
                                )}

                                {skalViseStengtBarnehageSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaStengt}
                                            legend="Har du vært hjemme fra jobb fordi skolen/barnehagen er stengt på grunn av koronaviruset?"
                                        />
                                    </FormBlock>
                                )}
                                {skalViseSykBarnepasserSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaSykdom}
                                            legend="Har du vært hjemme fra jobb fordi barnet eller barnepasser er blitt syk?"
                                        />
                                    </FormBlock>
                                )}

                                {skalViseErIkkeFrilansEllerSelvstendigInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <>
                                                <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                    Denne søknaden gjelder{' '}
                                                    <strong>kun for selvstendig næringsdrivende og frilansere</strong>{' '}
                                                    som skal søke om utbetaling av omsorgspenger.
                                                </p>
                                                <p>
                                                    Hvis du er <strong>arbeidstaker</strong>, skal du ikke søke om
                                                    utbetaling av omsorgspenger. Arbeidsgiveren din skal utbetale deg
                                                    lønn som vanlig de dagene du tar ut omsorgsdager.
                                                </p>
                                            </>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseKanIkkeBrukeSøknadenInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                Du kan <strong>kun</strong> bruke denne søknaden hvis du er hjemme fra
                                                jobb på grunn av én av situasjonene beskrevet over.
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseSmittevernInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                I søknaden må du laste opp en bekreftelse fra lege. Legen må bekrefte at
                                                barnet ikke kan gå i barnehage eller skole fordi det er{' '}
                                                <strong>særlige smittevernhensyn</strong> i forbindelse med
                                                koronaviruset som må ivaretas for enten barnet eller et familiemedlem
                                                som barnet bor sammen med. Legen skal ikke oppgi diagnose eller hvilket
                                                familiemedlem det gjelder.
                                            </p>
                                            <p>
                                                Hvis du ikke har bekreftelse tilgjengelig når du søker, kan du
                                                ettersende den. Vi kan ikke behandle søknaden før vi mottar
                                                bekreftelsen.
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {kanBrukeSøknaden && (
                                    <>
                                        <Box margin="xl" textAlignCenter={true}>
                                            <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                                <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                            </Lenke>
                                        </Box>
                                    </>
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
