import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Sidetittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import Page from 'common/components/page/Page';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import BehandlingAvPersonopplysningerModal from '../../information/behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../information/dine-plikter-modal/DinePlikterModal';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

interface WelcomingPageState {
    dinePlikterModalOpen: boolean;
    behandlingAvPersonopplysningerModalOpen: boolean;
}

type Props = Omit<StepConfigProps, 'formValues'> & WrappedComponentProps;

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
        const { onValidSubmit, intl } = this.props;
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
                    <SamtykkeForm
                        onOpenDinePlikterModal={this.openDinePlikterModal}
                        openBehandlingAvPersonopplysningerModal={this.openBehandlingAvPersonopplysningerModal}
                        onConfirm={onValidSubmit}
                    />
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
