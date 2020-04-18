import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Element } from 'nav-frontend-typografi';
import StatusIcon, { StatusIconStatusKey } from './status-icon/StatusIcon';

interface Props {
    image: React.ReactNode;
    status: StatusIconStatusKey;
    statusText: string;
    description: string;
}

const bem = bemUtils('pictureScanningGuide').child('example');

const PictureScanningExample: React.FunctionComponent<Props> = ({ image, status, statusText, description }) => (
    <div className={bem.block}>
        <div className={bem.element('image')}>{image}</div>
        <Element tag="div" className={bem.element('title')}>
            <span className={bem.element('statusIcon')} role="presentation">
                <StatusIcon status={status} />
            </span>
            {statusText}
        </Element>
        <div className={bem.element('description')}>{description}</div>
    </div>
);

export default PictureScanningExample;
