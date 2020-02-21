import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import LegeerklæringIcon from '../legeerklæring-icon/LegeerklæringWithArmIcon';
import './legeerklæringInformationPanel.less';

interface LegeerklæringInformationPanelProps {
    text: string;
}

const LegeerklæringInformationPanel: React.FunctionComponent<LegeerklæringInformationPanelProps> = ({ text }) => (
    <Veilederpanel svg={<LegeerklæringIcon />} kompakt={true}>
        {text}
    </Veilederpanel>
);

export default LegeerklæringInformationPanel;
