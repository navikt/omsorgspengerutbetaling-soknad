import React, {useEffect, useState} from 'react';
import Modal from 'nav-frontend-modal';
import { Endring } from '../types';
import { Textarea } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { Datovelger, ISODateString } from 'nav-datovelger';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { isDate } from 'moment';

const setInitialDate = (maybeEndring: Endring | undefined): Date | undefined => {
    return maybeEndring ? new Date(maybeEndring.dato.getTime()) : undefined;
};

const setInitialForklaring = (maybeEndring: Endring | undefined): string => {
    return maybeEndring ? maybeEndring.forklaring : '';
};

interface Props {
    maybeEndring: Endring | undefined;
    isOpen: boolean;
    saveEndring: (oppdatertEndring: Endring) => void;
    onRequestClose: () => void;
}

const EndringsModal: React.FC<Props> = ({ maybeEndring, isOpen, saveEndring, onRequestClose }: Props): JSX.Element => {

    const [newDate, setNewDate] = useState<Date | undefined>(setInitialDate(maybeEndring));
    const [nyForklaring, setNyForklaring] = useState<string>(setInitialForklaring(maybeEndring));

    const isValidEndring = nyForklaring.length > 0 && isDate(newDate);

    const handleSaveEndring = (): void => {
        if (newDate) {
            saveEndring({ dato: newDate, forklaring: nyForklaring });
            setNewDate(setInitialDate(maybeEndring));
            setNyForklaring(setInitialForklaring(maybeEndring));
        }
    };

    useEffect(() => {
        setNewDate(setInitialDate(maybeEndring));
        setNyForklaring(setInitialForklaring(maybeEndring));
    }, [maybeEndring, isOpen]);

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={'Legg til endring i arbeidssituasjon'}>
            <Textarea
                value={nyForklaring}
                id={'inntektsendring.endringsmodal.textarea'}
                label={'Forklar hva som har endret seg i arbeidssituasjonen din'}
                onChange={(evt) => setNyForklaring(evt.target.value)}
            />
            <Datovelger
                id={'inntektsendring.endringsmodal.textarea'}
                input={{ name: 'datovelgerName', placeholder: 'dd.mm.åååå', id: 'datovelgerId' }}
                valgtDato={datepickerUtils.getDateStringFromValue(newDate)}
                onChange={(dateString: ISODateString | undefined) => {
                    const maybeDate = dateString ? datepickerUtils.getDateFromDateString(dateString) : undefined;
                    if (maybeDate) {
                        setNewDate(maybeDate);
                    }
                }}
            />
            <Knapp disabled={!isValidEndring} onClick={handleSaveEndring} title={'lagre endring'}>
                Lagre endring
            </Knapp>
        </Modal>
    );
};

export default EndringsModal;
