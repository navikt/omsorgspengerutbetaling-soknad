import React, { useEffect, useState } from 'react';
import Modal from 'nav-frontend-modal';
import { Endring } from '../types';
import { Label, Textarea } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { Datovelger, ISODateString } from 'nav-datovelger';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { isDate } from 'moment';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { Element as NavElement } from 'nav-frontend-typografi';

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
    const intl = useIntl();
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
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={intlHelper(intl, 'inntektsendring.modal.contantLabel')}>
            <div className={'inntektsendring-modal-content-wrapper'}>
                <div className={'inntektsendring-modal-tittel-wrapper'}>
                    <Box padBottom={'xl'}>
                        <NavElement>Legg til endring i arbeidssituasjon</NavElement>
                    </Box>
                </div>
                <Box padBottom={'xl'}>
                    <Textarea
                        value={nyForklaring}
                        id={'inntektsendring.endringsmodal.textarea'}
                        label={intlHelper(intl, 'inntektsendring.modal.textarea.label')}
                        onChange={(evt) => setNyForklaring(evt.target.value)}
                    />
                </Box>

                <Box padBottom={'xl'}>
                    <Label htmlFor={'inntektsendring.endringsmodal.textarea'}>Når skjedde denne endringen?</Label>
                    <Datovelger
                        id={'inntektsendring.endringsmodal.textarea'}
                        input={{ name: 'datovelgerName', placeholder: 'dd.mm.åååå', id: 'datovelgerId' }}
                        valgtDato={datepickerUtils.getDateStringFromValue(newDate)}
                        onChange={(dateString: ISODateString | undefined) => {
                            const maybeDate = dateString
                                ? datepickerUtils.getDateFromDateString(dateString)
                                : undefined;
                            if (maybeDate) {
                                setNewDate(maybeDate);
                            }
                        }}
                        kalender={{ plassering: 'fullskjerm' }}
                    />
                </Box>
                <Box>
                    <Knapp
                        htmlType={'button'}
                        disabled={!isValidEndring}
                        onClick={handleSaveEndring}
                        title={intlHelper(intl, 'inntektsendring.modal.lagre_knapp.tekst')}>
                        {intlHelper(intl, 'inntektsendring.modal.lagre_knapp.tekst')}
                    </Knapp>
                </Box>
            </div>
        </Modal>
    );
};

export default EndringsModal;
