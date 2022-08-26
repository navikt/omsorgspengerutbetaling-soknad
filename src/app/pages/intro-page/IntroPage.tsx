import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Knappelenke from '@navikt/sif-common-core/lib/components/knappelenke/Knappelenke';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, UnansweredQuestionsInfo, YesOrNo } from '@navikt/sif-common-formik/lib';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import RouteConfig, { getRouteUrl } from '../../config/routeConfig';
import './introPage.less';

const bem = bemUtils('introPage');

enum PageFormField {
    'erSelvstendigEllerFrilanser' = 'erSelvstendigEllerFrilanser',
    'hjemmePgaStengt' = 'hjemmePgaStengt',
    'smittevernHensyn' = 'smittevernHensyn',
}

interface PageFormValues {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo;
    [PageFormField.hjemmePgaStengt]: YesOrNo;
    [PageFormField.smittevernHensyn]: YesOrNo;
}

const initialValues = {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo.UNANSWERED,
    [PageFormField.hjemmePgaStengt]: YesOrNo.UNANSWERED,
    [PageFormField.smittevernHensyn]: YesOrNo.UNANSWERED,
};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues, ValidationError>();

const IntroPage: React.FC = () => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.intro);
    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        <FormattedHtmlMessage id="introPage.info.1.html" />
                    </p>
                    <p>
                        <FormattedMessage id="introPage.info.2" />
                        <Lenke
                            href="https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding"
                            target="_blank">
                            <FormattedHtmlMessage id="introPage.info.3" />
                        </Lenke>
                        .
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({ values: { erSelvstendigEllerFrilanser, hjemmePgaStengt, smittevernHensyn } }) => {
                        const kanBrukeSøknaden =
                            (erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.YES) ||
                            (erSelvstendigEllerFrilanser === YesOrNo.YES &&
                                smittevernHensyn === YesOrNo.NO &&
                                hjemmePgaStengt === YesOrNo.YES);

                        const skalViseSmittevernSpørsmål = erSelvstendigEllerFrilanser === YesOrNo.YES;

                        const skalViseStengtBarnehageSpørsmål =
                            erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.NO;

                        const skalViseSmittevernInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.YES;

                        const skalViseStengtBhgSkoleInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            skalViseSmittevernInfo !== true &&
                            hjemmePgaStengt === YesOrNo.YES;

                        const skalViseErIkkeFrilansEllerSelvstendigInfo = erSelvstendigEllerFrilanser === YesOrNo.NO;
                        const skalViseKanIkkeBrukeSøknadenInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO;

                        return (
                            <PageForm.Form
                                formErrorHandler={intlFormErrorHandler(intl, 'introForm')}
                                includeButtons={false}
                                noButtonsContentRenderer={() => {
                                    return kanBrukeSøknaden ||
                                        skalViseKanIkkeBrukeSøknadenInfo ||
                                        skalViseErIkkeFrilansEllerSelvstendigInfo ? null : (
                                        <UnansweredQuestionsInfo>
                                            <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                        </UnansweredQuestionsInfo>
                                    );
                                }}>
                                <PageForm.YesOrNoQuestion
                                    name={PageFormField.erSelvstendigEllerFrilanser}
                                    legend={intlHelper(intl, 'introPage.form.spm.erSelvstendigEllerFrilanser')}
                                />

                                {skalViseSmittevernSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.smittevernHensyn}
                                            legend={intlHelper(intl, 'introPage.form.spm.smittevernhensyn')}
                                            description={
                                                <ExpandableInfo
                                                    title={intlHelper(
                                                        intl,
                                                        'introPage.form.spm.smittevernhensyn.description.tittel'
                                                    )}>
                                                    <FormattedHtmlMessage id="introPage.form.spm.smittevernhensyn.description.info.html" />
                                                </ExpandableInfo>
                                            }
                                        />
                                    </FormBlock>
                                )}

                                {skalViseStengtBarnehageSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaStengt}
                                            legend={intlHelper(intl, 'introPage.form.spm.hjemmePgaStengt')}
                                        />
                                    </FormBlock>
                                )}

                                {skalViseErIkkeFrilansEllerSelvstendigInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <>
                                                <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                    <FormattedHtmlMessage id="introPage.søknadGjelderKunFor.1.html" />
                                                </p>
                                                <p>
                                                    <FormattedHtmlMessage id="introPage.søknadGjelderKunFor.2.html" />
                                                </p>
                                            </>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseKanIkkeBrukeSøknadenInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="introPage.kanIkkeBrukeSøknad.html" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseStengtBhgSkoleInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="introPage.stengtBhgSkole.1" />
                                            </p>
                                            <p>
                                                <FormattedHtmlMessage id="introPage.stengtBhgSkole.2" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseSmittevernInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="introPage.smittevernInfo.1.html" />
                                            </p>
                                            <p>
                                                <FormattedHtmlMessage id="introPage.smittevernInfo.2" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {kanBrukeSøknaden && (
                                    <>
                                        <Box
                                            margin="xl"
                                            textAlignCenter={true}
                                            className={bem.element('gaTilSoknadenKnappelenkeWrapper')}>
                                            <Knappelenke
                                                type={'hoved'}
                                                href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                                <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                            </Knappelenke>
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
