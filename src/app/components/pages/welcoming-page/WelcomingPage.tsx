import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Sidetittel } from 'nav-frontend-typografi';
import CounsellorPanel from '@navikt/sif-common/lib/common/components/counsellor-panel/CounsellorPanel';
import FormikYesOrNoQuestion from '@navikt/sif-common/lib/common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { userHasSubmittedValidForm } from '@navikt/sif-common/lib/common/formik/formikUtils';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import Page from 'common/components/page/Page';
import FormikConfirmationCheckboxPanel from 'common/formik/formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';
import { HistoryProps } from 'common/types/History';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { navigateTo } from '../../../utils/navigationUtils';
import BehandlingAvPersonopplysningerModal from '../../behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../dine-plikter-modal/DinePlikterModal';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

interface WelcomingPageProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

interface WelcomingPageState {
    dinePlikterModalOpen: boolean;
    behandlingAvPersonopplysningerModalOpen: boolean;
}

type Props = CommonStepFormikProps & WelcomingPageProps & HistoryProps & StepConfigProps & WrappedComponentProps;

class WelcomingPage extends React.Component<Props, WelcomingPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dinePlikterModalOpen: false,
            behandlingAvPersonopplysningerModalOpen: false
        };

        this.openDinePlikterModal = this.openDinePlikterModal.bind(this);
        this.closeDinePlikterModal = this.closeDinePlikterModal.bind(this);
        this.openBehandlingAvPersonopplysningerModal = this.openBehandlingAvPersonopplysningerModal.bind(this);
        this.closeBehandlingAvPersonopplysningerModal = this.closeBehandlingAvPersonopplysningerModal.bind(this);
    }

    componentDidUpdate(previousProps: Props) {
        if (userHasSubmittedValidForm(previousProps, this.props)) {
            const { history, nextStepRoute } = this.props;
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        }
    }

    openDinePlikterModal() {
        this.setState({
            dinePlikterModalOpen: true
        });
    }

    closeDinePlikterModal() {
        this.setState({
            dinePlikterModalOpen: false
        });
    }

    openBehandlingAvPersonopplysningerModal() {
        this.setState({
            behandlingAvPersonopplysningerModalOpen: true
        });
    }

    closeBehandlingAvPersonopplysningerModal() {
        this.setState({
            behandlingAvPersonopplysningerModalOpen: false
        });
    }

    render() {
        const { handleSubmit, intl, formValues } = this.props;
        const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = this.state;

        return (
            <>
                <Page
                    title={intlHelper(intl, 'welcomingPage.sidetittel')}
                    className={bem.block}
                    topContentRenderer={() => (
                        <FrontPageBanner
                            bannerSize="large"
                            counsellorWithSpeechBubbleProps={{
                                strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                                normalText: intlHelper(intl, 'welcomingPage.banner.tekst')
                            }}
                        />
                    )}>
                    <Box margin="xxl">
                        <Sidetittel className={bem.element('title')}>
                            <FormattedMessage id="welcomingPage.introtittel" />
                        </Sidetittel>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Box margin="xl">
                            <FormikYesOrNoQuestion<AppFormField>
                                name={AppFormField.kroniskEllerFunksjonshemming}
                                legend={intlHelper(intl, 'introPage.spm.kroniskEllerFunksjonshemmende')}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>

                        <Box margin="xl">
                            {formValues.kroniskEllerFunksjonshemming === YesOrNo.NO && (
                                <CounsellorPanel>
                                    <p>
                                        <FormattedHTMLMessage
                                            id={`introPage.infoIkkeKroniskEllerFunksjonshemmende.html`}
                                            values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                                        />
                                    </p>
                                </CounsellorPanel>
                            )}
                            {formValues.kroniskEllerFunksjonshemming === YesOrNo.YES && (
                                <>
                                    <CounsellorPanel>
                                        <FormattedHTMLMessage id={`introPage.legeerklæring.html`} />
                                    </CounsellorPanel>
                                    <Box margin="xl">
                                        <FormikConfirmationCheckboxPanel<AppFormField>
                                            label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                                            name={AppFormField.harForståttRettigheterOgPlikter}
                                            validate={(value) => {
                                                let result;
                                                if (value !== true) {
                                                    result = intlHelper(
                                                        intl,
                                                        'welcomingPage.samtykke.harIkkeGodkjentVilkår'
                                                    );
                                                }
                                                return result;
                                            }}>
                                            <FormattedMessage
                                                id="welcomingPage.samtykke.harForståttLabel"
                                                values={{
                                                    plikterLink: (
                                                        <Lenke href="#" onClick={this.openDinePlikterModal}>
                                                            {intlHelper(
                                                                intl,
                                                                'welcomingPage.samtykke.harForståttLabel.lenketekst'
                                                            )}
                                                        </Lenke>
                                                    )
                                                }}
                                            />
                                        </FormikConfirmationCheckboxPanel>
                                    </Box>
                                    <Box margin="xl">
                                        <Hovedknapp className={bem.element('startApplicationButton')}>
                                            {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                                        </Hovedknapp>
                                    </Box>
                                    <Box margin="xl" className={bem.element('personopplysningModalLenke')}>
                                        <Lenke href="#" onClick={this.openBehandlingAvPersonopplysningerModal}>
                                            <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                                        </Lenke>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </form>
                </Page>
                <DinePlikterModal
                    isOpen={dinePlikterModalOpen}
                    onRequestClose={this.closeDinePlikterModal}
                    contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
                />
                <BehandlingAvPersonopplysningerModal
                    isOpen={behandlingAvPersonopplysningerModalOpen}
                    onRequestClose={this.closeBehandlingAvPersonopplysningerModal}
                    contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
                />
            </>
        );
    }
}

export default injectIntl(WelcomingPage);
