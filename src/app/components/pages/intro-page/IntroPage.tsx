import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, UnansweredQuestionsInfo, YesOrNo } from '@navikt/sif-common-formik/lib';
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
import Knappelenke from 'common/components/knappelenke/Knappelenke';
import './introPage.less';
import { isCurrentDateBefore2021 } from '../../../utils/checkDate2021';

const bem = bemUtils('introPage');

enum PageFormField {
    'erSelvstendigEllerFrilanser' = 'erSelvstendigEllerFrilanser',
    'hjemmePgaStengt' = 'hjemmePgaStengt',
    'hjemmePgaSykdom' = 'hjemmePgaSykdom',
    'smittevernHensyn' = 'smittevernHensyn',
    'hjemmePgaKarantene' = 'hjemmePgaKarantene',
}

interface PageFormValues {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo;
    [PageFormField.hjemmePgaStengt]: YesOrNo;
    [PageFormField.hjemmePgaSykdom]: YesOrNo;
    [PageFormField.smittevernHensyn]: YesOrNo;
    [PageFormField.hjemmePgaKarantene]: YesOrNo;
}

const initialValues = {
    [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo.UNANSWERED,
    [PageFormField.hjemmePgaStengt]: YesOrNo.UNANSWERED,
    [PageFormField.hjemmePgaSykdom]: YesOrNo.UNANSWERED,
    [PageFormField.smittevernHensyn]: YesOrNo.UNANSWERED,
    [PageFormField.hjemmePgaKarantene]: YesOrNo.UNANSWERED,
};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        <FormattedHtmlMessage id="steg.intro.info.1.html" />
                        <Lenke
                            href="https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding"
                            target="_blank">
                            <FormattedHtmlMessage id="steg.intro.info.2" />
                        </Lenke>
                        .
                    </p>
                    <p>
                        <FormattedHtmlMessage id="steg.intro.info.3" />
                    </p>
                    <ul>
                        <li>
                            <FormattedHtmlMessage id="steg.intro.info.4" />
                        </li>
                        <li>
                            <FormattedHtmlMessage id="steg.intro.info.5" />
                        </li>
                        <li>
                            <FormattedHtmlMessage id="steg.intro.info.6" />
                        </li>
                        <li>
                            <FormattedHtmlMessage id="steg.intro.info.6.1" />
                        </li>
                    </ul>
                    <p>
                        <FormattedHtmlMessage id="steg.intro.info.7.1" />
                        <Lenke href="https://www.nav.no/arbeid/inntektskompensasjon" target="_blank">
                            <FormattedHtmlMessage id="steg.intro.info.7.2" />
                        </Lenke>
                        <FormattedHtmlMessage id="steg.intro.info.7.3" />
                    </p>
                    <p>
                        <FormattedHtmlMessage id="steg.intro.info.8.1" />
                        <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss" target="_blank">
                            <FormattedHtmlMessage id="steg.intro.info.8.2" />
                        </Lenke>
                        <FormattedHtmlMessage id="steg.intro.info.8.3" />
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({
                        values: {
                            erSelvstendigEllerFrilanser,
                            hjemmePgaStengt,
                            hjemmePgaSykdom,
                            smittevernHensyn,
                            hjemmePgaKarantene,
                        },
                    }) => {
                        const kanBrukeSøknaden =
                            (erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.YES) ||
                            (erSelvstendigEllerFrilanser === YesOrNo.YES &&
                                smittevernHensyn === YesOrNo.NO &&
                                hjemmePgaStengt === YesOrNo.YES) ||
                            (erSelvstendigEllerFrilanser === YesOrNo.YES &&
                                smittevernHensyn === YesOrNo.NO &&
                                hjemmePgaStengt === YesOrNo.NO &&
                                hjemmePgaSykdom === YesOrNo.YES &&
                                hjemmePgaKarantene === YesOrNo.YES);

                        const skalViseSmittevernSpørsmål = erSelvstendigEllerFrilanser === YesOrNo.YES;

                        const skalViseStengtBarnehageSpørsmål =
                            erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.NO;

                        const skalViseSykBarnepasserSpørsmål =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO;

                        const skalViseKaranteneSpørsmål =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO &&
                            hjemmePgaSykdom === YesOrNo.YES;

                        const skalViseSmittevernInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES && smittevernHensyn === YesOrNo.YES;

                        const skalViseStengtBhgSkoleInfo =
                            skalViseSmittevernInfo !== true && hjemmePgaStengt === YesOrNo.YES;

                        const skalViseErIkkeFrilansEllerSelvstendigInfo = erSelvstendigEllerFrilanser === YesOrNo.NO;
                        const skalViseKanIkkeBrukeSøknadenInfo =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO &&
                            hjemmePgaSykdom === YesOrNo.NO;

                        const skalViseKanIkkeBrukeSøknadenInfoKarantene =
                            erSelvstendigEllerFrilanser === YesOrNo.YES &&
                            smittevernHensyn === YesOrNo.NO &&
                            hjemmePgaStengt === YesOrNo.NO &&
                            hjemmePgaSykdom === YesOrNo.YES &&
                            hjemmePgaKarantene === YesOrNo.NO;

                        const skalViseKanIkkeBrukeSøknaden =
                            skalViseKanIkkeBrukeSøknadenInfo || skalViseKanIkkeBrukeSøknadenInfoKarantene;

                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}
                                noButtonsContentRenderer={() => {
                                    return kanBrukeSøknaden ||
                                        skalViseKanIkkeBrukeSøknaden ||
                                        skalViseErIkkeFrilansEllerSelvstendigInfo ? null : (
                                        <UnansweredQuestionsInfo>
                                            <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                        </UnansweredQuestionsInfo>
                                    );
                                }}>
                                <PageForm.YesOrNoQuestion
                                    name={PageFormField.erSelvstendigEllerFrilanser}
                                    legend={intlHelper(intl, 'steg.intro.form.spm.erSelvstendigEllerFrilanser')}
                                />

                                {skalViseSmittevernSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.smittevernHensyn}
                                            legend={intlHelper(intl, 'steg.intro.form.spm.smittevernhensyn')}
                                            description={
                                                <ExpandableInfo title={intlHelper(intl, 'info.smittevern.tittel')}>
                                                    <SmittevernInfo />
                                                </ExpandableInfo>
                                            }
                                        />
                                    </FormBlock>
                                )}

                                {skalViseStengtBarnehageSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaStengt}
                                            legend={
                                                isCurrentDateBefore2021()
                                                    ? intlHelper(intl, 'steg.intro.form.spm.hjemmePgaStengt')
                                                    : intlHelper(intl, 'steg.intro.form.spm.hjemmePgaStengt.2021')
                                            }
                                        />
                                    </FormBlock>
                                )}
                                {skalViseSykBarnepasserSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaSykdom}
                                            legend={intlHelper(intl, 'steg.intro.form.spm.hjemmePgaSykdom')}
                                        />
                                    </FormBlock>
                                )}

                                {skalViseKaranteneSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaKarantene}
                                            legend={intlHelper(intl, 'steg.intro.form.spm.hjemmePgaKarantene')}
                                        />
                                    </FormBlock>
                                )}

                                {skalViseErIkkeFrilansEllerSelvstendigInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <>
                                                <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                    <FormattedHtmlMessage id="steg.intro.søknadGjelderKunFor.1.html" />
                                                </p>
                                                <p>
                                                    <FormattedHtmlMessage id="steg.intro.søknadGjelderKunFor.2.html" />
                                                </p>
                                            </>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseKanIkkeBrukeSøknaden && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="steg.intro.kanIkkeBrukeSøknad.html" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseStengtBhgSkoleInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="steg.intro.stengtBhgSkole.1" />
                                            </p>
                                            <p>
                                                <FormattedHtmlMessage id="steg.intro.stengtBhgSkole.2" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseSmittevernInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="steg.intro.smittevernInfo.1.html" />
                                            </p>
                                            <p>
                                                <FormattedHtmlMessage id="steg.intro.smittevernInfo.2" />
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
