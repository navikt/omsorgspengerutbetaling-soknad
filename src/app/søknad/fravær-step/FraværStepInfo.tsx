import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';

const IntroVeileder = () => {
    return (
        <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
            <p>
                <FormattedMessage id="step.fravaer.info.1" />
            </p>
            <p>
                <FormattedMessage id="step.fravaer.info.2" />
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

const HarDekketTiFørsteDagerSelv = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'step.fravaer.dekkeSelv.info.tittel')}>
            <p style={{ marginTop: '0' }}>
                <FormattedMessage id="step.fravaer.dekkeSelv.info.1" />
            </p>
            <p>
                <FormattedMessage id="step.fravaer.dekkeSelv.info.2" />{' '}
                <Lenke href={getLenker(intl.locale).søkeEkstraDager}>
                    <FormattedMessage id="step.fravaer.dekkeSelv.info.3" />
                </Lenke>
            </p>
        </ExpandableInfo>
    );
};

const FraværStepInfo = {
    IntroVeileder,
    HarDekketTiFørsteDagerSelv,
    Tidsbegrensning,
};

export default FraværStepInfo;
