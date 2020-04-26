import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import PictureScanningExample from './PictureScanningExample';
import ScanningIcon from './scanning-icon/ScanningIcon';
import './pictureScanningGuide.less';

const bem = bemUtils('pictureScanningGuide');

const PictureScanningGuide: React.FunctionComponent = () => {
    const intl = useIntl();
    const svgIconHeight = 100;
    return (
        <div className={bem.block}>
            <Undertittel className={bem.element('title')}>
                <FormattedMessage id="psg-temp.section1.tittel" />
            </Undertittel>
            <FormattedHTMLMessage tagName="ul" id="psg-temp.section1.liste" />

            <Undertittel className={bem.element('title')}>
                <FormattedMessage id="psg-temp.section2.tittel" />
            </Undertittel>

            <FormattedHTMLMessage tagName="ul" id="psg-temp.section2.liste" />
            <div className={bem.element('examples')}>
                <Undertittel tag="h3" className={bem.element('title')}>
                    <FormattedMessage id="psg-temp.icon.heading" />
                </Undertittel>
                <div className={bem.element('body')}>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="good" height={svgIconHeight} />}
                            status="suksess"
                            statusText={intlHelper(intl, 'psg-temp.good')}
                            description={intlHelper(intl, 'psg-temp.icon.label.good')}
                        />
                    </div>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                            status="feil"
                            statusText={intlHelper(intl, 'psg-temp.bad')}
                            description={intlHelper(intl, 'psg-temp.icon.label.keystone')}
                        />
                    </div>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                            status="feil"
                            statusText={intlHelper(intl, 'psg-temp.bad')}
                            description={intlHelper(intl, 'psg-temp.icon.label.horizontal')}
                        />
                    </div>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                            status="feil"
                            statusText={intlHelper(intl, 'psg-temp.bad')}
                            description={intlHelper(intl, 'psg-temp.icon.label.shadow')}
                        />
                    </div>
                </div>
                <Lenke target="_blank" href={intlHelper(intl, 'psg-temp.lenkepanel.url')}>
                    <FormattedMessage id="psg-temp.lenkepanel.text" />
                </Lenke>
            </div>
        </div>
    );
};
export default PictureScanningGuide;
