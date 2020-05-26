import React, { useState } from 'react';
import EndringsModal from './EndringsModal';
import { Endring } from '../types';
import { Knapp } from 'nav-frontend-knapper';
import intlHelper from "common/utils/intlUtils";
import {useIntl} from "react-intl";

interface Props {
    onSaveNewEndring: (endring: Endring) => void;
}

const NyEndringView: React.FC<Props> = ({ onSaveNewEndring }: Props): JSX.Element => {
    const intl = useIntl();
    const [nyEndringModalIsOpen, setNyEndringModalIsOpen] = useState<boolean>(false);

    const handleSaveEndring = (endring: Endring): void => {
        onSaveNewEndring(endring);
    };

    return (
        <div>
            <Knapp htmlType={'button'} title={'Ny endring'} onClick={() => setNyEndringModalIsOpen(true)}>
                {intlHelper(intl, 'inntektsendring.ny_endring.button_tekst')}
            </Knapp>
            <EndringsModal
                saveEndring={(endring: Endring) => {
                    setNyEndringModalIsOpen(false);
                    return handleSaveEndring(endring);
                }}
                maybeEndring={undefined}
                isOpen={nyEndringModalIsOpen}
                onRequestClose={() => setNyEndringModalIsOpen(false)}
            />
        </div>
    );
};

export default NyEndringView;
