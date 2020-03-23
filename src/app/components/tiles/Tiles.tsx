import * as React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import './tiles.less';

const bem = bemUtils('tiles');

const Tiles: React.StatelessComponent<{ columns?: 1 | 2 | 3 | 'flex' }> = ({ columns = 3, children }) => (
    <div className={bem.classNames(bem.block, bem.modifier(`columns-${columns}`))}>
        {React.Children.map(children, (child) => (
            <div className={bem.element('tile')}>{child}</div>
        ))}
    </div>
);

export default Tiles;
