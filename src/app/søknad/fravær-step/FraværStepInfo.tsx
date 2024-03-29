import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

const IntroVeileder = () => {
    const inneværendeÅr = new Date().getFullYear();
    const forrigeÅr = inneværendeÅr - 1;
    return (
        <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
            <p>
                <FormattedMessage id="step.fravaer.info.1" />
            </p>
            <p>
                <FormattedMessage id="step.fravaer.info.2" values={{ forrigeÅr, inneværendeÅr }} />
            </p>
        </CounsellorPanel>
    );
};

const Tidsbegrensning = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'step.fravaer.info.ikkeHelg.tittel')}>
            <FormattedMessage id="step.fravaer.info.ikkeHelg.tekst" />
        </ExpandableInfo>
    );
};

const FraværStepInfo = {
    IntroVeileder,
    Tidsbegrensning,
};

export default FraværStepInfo;
