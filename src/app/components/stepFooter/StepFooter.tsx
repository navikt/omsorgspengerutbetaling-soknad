import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActionLink from 'common/components/action-link/ActionLink';
import AvbrytSøknadDialog from 'common/components/dialogs/avbrytSøknadDialog/AvbrytSøknadDialog';
import FortsettSøknadSenereDialog from 'common/components/dialogs/fortsettSøknadSenereDialog/FortsettSøknadSenereDialog';
import bemHelper from 'common/utils/bemUtils';
import SøknadTempStorage from '../../søknad/SøknadTempStorage';
import { navigateToNAVno, navigateToWelcomePage } from '../../utils/navigationUtils';
import './stepFooter.less';

function StepFooter() {
    const [visAvbrytDialog, setVisAvbrytDialog] = React.useState<boolean>(false);
    const [visFortsettSenereDialog, setVisFortsettSenereDialog] = React.useState<boolean>(false);

    const handleAvsluttOgFortsettSenere = () => {
        navigateToNAVno();
    };
    const handleAvbrytSøknad = () => {
        SøknadTempStorage.purge().then(() => {
            navigateToWelcomePage();
        });
    };

    const bem = bemHelper('stepFooter');
    return (
        <>
            <div className={bem.block}>
                <div className={bem.element('divider')} />
                <div className={bem.element('links')}>
                    <ActionLink onClick={() => setVisFortsettSenereDialog(true)}>
                        <FormattedMessage id="steg.footer.fortsettSenere" />
                    </ActionLink>
                    <span className={bem.element('dot')} aria-hidden={true} />
                    <ActionLink className={bem.element('avbrytSoknadLenke')} onClick={() => setVisAvbrytDialog(true)}>
                        <FormattedMessage id="steg.footer.avbryt" />
                    </ActionLink>
                </div>
            </div>
            <FortsettSøknadSenereDialog
                synlig={visFortsettSenereDialog}
                onFortsettSøknadSenere={() => handleAvsluttOgFortsettSenere()}
                onFortsettSøknad={() => setVisFortsettSenereDialog(false)}
            />
            <AvbrytSøknadDialog
                synlig={visAvbrytDialog}
                onAvbrytSøknad={() => handleAvbrytSøknad()}
                onFortsettSøknad={() => setVisAvbrytDialog(false)}
            />
        </>
    );
}

export default StepFooter;
