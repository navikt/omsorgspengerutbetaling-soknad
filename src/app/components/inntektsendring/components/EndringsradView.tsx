import React, { useState } from 'react';
import { Endring } from '../types';
import EndringsModal from './EndringsModal';
import { prettifyDateExtended } from 'common/utils/dateUtils';
import DeleteButton from 'common/components/delete-button/DeleteButton';
import bemUtils from '@navikt/sif-common-formik/lib/utils/bemUtils';
import '../inntektsendring.less';
import ActionLink from 'common/components/action-link/ActionLink';

const bem = bemUtils('itemList');
const bemItem = bem.child('item');

interface Props {
    endring: Endring;
    onSaveEditedEndring: (endring: Endring) => void;
    onDeleteEndring: () => void;
}

const forsteXTegnAv = (tekst: string, x: number): string => {
    return tekst.length > x ? `${tekst.slice(0, x)}...` : tekst;
};

const EndringsradView: React.FC<Props> = ({ endring, onSaveEditedEndring, onDeleteEndring }: Props): JSX.Element => {
    const [endringsmodalIsOpen, setEndringsmodalIsOpen] = useState<boolean>(false);

    return (
        <li className={'inntektsendring__row'}>
            <div className={'inntektsendring-flex-wrapper'}>
                <span className={"dateMinWidth"}>{prettifyDateExtended(endring.dato)}</span>
                <span className={bemItem.element('label')}>
                    <ActionLink onClick={() => setEndringsmodalIsOpen(true)}>
                        {forsteXTegnAv(endring.forklaring, 40)}
                    </ActionLink>
                </span>
            </div>
            <span className={'inntektsendring__delete'}>
                <DeleteButton ariaLabel={`Fjern endring`} onClick={onDeleteEndring} />
            </span>
            <EndringsModal
                saveEndring={(endringToSave: Endring) => {
                    setEndringsmodalIsOpen(false);
                    return onSaveEditedEndring(endringToSave);
                }}
                maybeEndring={endring}
                isOpen={endringsmodalIsOpen}
                onRequestClose={() => setEndringsmodalIsOpen(false)}
            />
        </li>
    );
};

export default EndringsradView;
