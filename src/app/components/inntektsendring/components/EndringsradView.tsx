import React, { useState } from 'react';
import { Endring } from '../types';
import { dateToISOFormattedDateString } from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import EndringsModal from './EndringsModal';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    endring: Endring;
    onSaveEditedEndring: (endring: Endring) => void;
    onDeleteEndring: () => void;
}

const EndringsradView: React.FC<Props> = ({ endring, onSaveEditedEndring, onDeleteEndring }: Props): JSX.Element => {
    const [endringsmodalIsOpen, setEndringsmodalIsOpen] = useState<boolean>(false);

    return (
        <div>
            <p>Dato: {dateToISOFormattedDateString(endring.dato)}</p>
            <p>Forklaring: {endring.forklaring}</p>
            <Knapp title={'Endre'} type={'flat'} onClick={() => setEndringsmodalIsOpen(true)}>Endre</Knapp>
            <Knapp title={'Fjern'} type={'flat'} onClick={onDeleteEndring}>Fjern</Knapp>
            <EndringsModal
                saveEndring={(endringToSave: Endring) => {
                    setEndringsmodalIsOpen(false);
                    return onSaveEditedEndring(endringToSave);
                }}
                maybeEndring={endring}
                isOpen={endringsmodalIsOpen}
                onRequestClose={() => setEndringsmodalIsOpen(false)}
            />
        </div>
    );
};

export default EndringsradView;
