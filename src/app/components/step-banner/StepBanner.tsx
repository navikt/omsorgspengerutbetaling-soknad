import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Banner from 'common/components/banner/Banner';
import bemHelper from 'common/utils/bemUtils';
import './stepBanner.less';

interface StepBannerProps {
    text: string;
}

const bem = bemHelper('stepBanner');
const StepBanner: React.FunctionComponent<StepBannerProps> = ({ text }) => (
    <Banner size="small" className={bem.block}>
        <Undertittel tag="h2">{text}</Undertittel>
    </Banner>
);

export default StepBanner;
