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
                        Denne søknaden bruker du når du er <strong>selvstendig næringsdrivende eller frilanser</strong>{' '}
                        og skal søke om utbetaling av omsorgspenger. Dette er i situasjoner du har vært hjemme fra jobb
                        fordi
                    </p>
                    <ul>
                        <li>barnehagen eller skolen er stengt på grunn av koronaviruset</li>
                        <li>barnet eller barnepasser er syk</li>
                        <li>barnet må være hjemme fra skole/barnehage på grunn av særlig smittevernhensyn</li>
                    </ul>
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
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            (hjemmePgaStengt === YesOrNo.YES || hjemmePgaSykdom === YesOrNo.YES) &&
                            smittevernHensyn !== YesOrNo.UNANSWERED;
                        const kanIkkeBrukeSøknaden =
                            erSelvstendigEllerFrilanser === YesOrNo.NO ||
                            (hjemmePgaStengt === YesOrNo.NO && hjemmePgaSykdom === YesOrNo.NO);
                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}>
                                <PageForm.YesOrNoQuestion
                                    name={PageFormField.erSelvstendigEllerFrilanser}
                                    legend="Er du selvstendig næringsdrivende eller frilanser?"
                                />
                                {erSelvstendigEllerFrilanser === YesOrNo.YES && (
                                    <>
                                        <FormBlock>
                                            <PageForm.YesOrNoQuestion
                                                name={PageFormField.hjemmePgaStengt}
                                                legend="Er du hjemme fra jobb fordi skolen/barnehagen er stengt på grunn av koronaviruset?"
                                            />
                                        </FormBlock>
                                        {hjemmePgaStengt === YesOrNo.NO && (
                                            <FormBlock>
                                                <PageForm.YesOrNoQuestion
                                                    name={PageFormField.hjemmePgaSykdom}
                                                    legend="Er du hjemme fra jobb fordi barnet eller barnepasser er blitt syk?"
                                                />
                                            </FormBlock>
                                        )}
                                        {(hjemmePgaStengt === YesOrNo.YES || hjemmePgaSykdom !== YesOrNo.UNANSWERED && !kanIkkeBrukeSøknaden) && (
                                            <FormBlock>
                                                <PageForm.YesOrNoQuestion
                                                    name={PageFormField.smittevernHensyn}
                                                    legend="Er du hjemme med barn grunnet smittevernhensyn?"
                                                />
                                            </FormBlock>
                                        )}
                                    </>
                                )}

                                {kanIkkeBrukeSøknaden && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            {erSelvstendigEllerFrilanser === YesOrNo.NO && (
                                                <>
                                                    <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                        Denne søknaden gjelder{' '}
                                                        <strong>
                                                            kun for selvstendig næringsdrivende og frilansere
                                                        </strong>{' '}
                                                        som skal søke om utbetaling av omsorgspenger.
                                                    </p>
                                                    <p>
                                                        Hvis du er <strong>arbeidstaker</strong>, skal du ikke søke om
                                                        utbetaling av omsorgspenger. Arbeidsgiveren din skal utbetale
                                                        deg lønn som vanlig de dagene du tar ut omsorgsdager.
                                                    </p>
                                                </>
                                            )}
                                            {erSelvstendigEllerFrilanser === YesOrNo.YES && (
                                                <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                    Du kan <strong>kun</strong> bruke denne søknaden når du må være
                                                    hjemme fra jobb fordi barnehagen/skolen er stengt på grunn av
                                                    koronaviruset, eller fordi barnet/barnepasser er blitt syk.
                                                </p>
                                            )}
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {!kanIkkeBrukeSøknaden && smittevernHensyn && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p>
                                                Bekreftelse fra lege på at særlig smittevernhensyn må ivaretas, og at
                                                det er årsaken til at barnet ikke kan gå i barnehage eller skole, må
                                                legges ved søknaden.
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
