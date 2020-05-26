import React, { useState } from 'react';
import { Endring } from '../types';
import EndringsModal from './EndringsModal';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import '../inntektsendring.less';
import { prettifyDateExtended } from 'common/utils/dateUtils';

interface Props {
    endring: Endring;
    onSaveEditedEndring: (endring: Endring) => void;
    onDeleteEndring: () => void;
}

const forsteXTegnAv = (tekst: string, x: number): string => {
    return tekst.length > x ? `${tekst.slice(0, x)}...` : tekst;
};

const EndringsradView: React.FC<Props> = ({ endring, onSaveEditedEndring, onDeleteEndring }: Props): JSX.Element => {
    const intl = useIntl();
    const [endringsmodalIsOpen, setEndringsmodalIsOpen] = useState<boolean>(false);

    return (
        <li className={'inntektsendring-list__item'}>
            <div>
                <div>{prettifyDateExtended(endring.dato)}</div>
                <div>{forsteXTegnAv(endring.forklaring, 40)}</div>
            </div>
            <div>
                <Lenke className={'inntektsendring-knapp1'} href="#" onClick={() => setEndringsmodalIsOpen(true)}>
                    {intlHelper(intl, 'inntektsendring.liste.knapp.endre')}
                </Lenke>
                <Lenke className={'inntektsendring-knapp2'} href="#" onClick={onDeleteEndring}>
                    {intlHelper(intl, 'inntektsendring.liste.knapp.fjern')}
                </Lenke>
            </div>

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
