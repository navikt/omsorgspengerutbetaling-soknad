import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Undertittel } from 'nav-frontend-typografi';
import './summarySection.less';

interface Props {
    header: string;
    headerTag?: 'h2' | 'h3' | 'h4';
}

const bem = bemUtils('summarySection');

const SummarySection: React.FunctionComponent<Props> = ({ header, headerTag = 'h2', children }) => (
    <div className={bem.block}>
        <Undertittel tag={headerTag} className={bem.element('header')}>
            {header}
        </Undertittel>
        {children}
    </div>
);

export default SummarySection;
