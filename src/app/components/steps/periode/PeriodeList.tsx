import React from 'react';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import {prettifyDateExtended} from '@navikt/sif-common-core/lib/utils/dateUtils';
import './periodeList.less';
import {Periode} from '../../../../@types/omsorgspengerutbetaling-schema';

interface Props {
    perioder: Periode[];
    onEdit?: (periode: Periode) => void;
    onDelete?: (periode: Periode) => void;
}

const bem = bemUtils('periodeList');

const PeriodeList: React.FunctionComponent<Props> = ({ perioder, onDelete, onEdit }) => {
    const renderPeriodeLabel = (opphold: Periode): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(opphold.fom)} - {prettifyDateExtended(opphold.tom)}
                </span>
            </div>
        );
    };

    return (
        <ItemList<Periode>
            getItemId={(opphold) => opphold.fom.toDateString()}
            getItemTitle={(opphold) => `Fra og med ${opphold.fom}, til og med ${opphold.tom}`}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderPeriodeLabel}
            items={perioder}
        />
    );
};

export default PeriodeList;
