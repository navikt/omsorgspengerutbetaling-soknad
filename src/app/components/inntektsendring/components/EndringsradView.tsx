import React, { useState } from 'react';
import { Endring } from '../types';
import { dateToISOFormattedDateString } from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import EndringsModal from './EndringsModal';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import '../inntektsendring.less';
import Lenke from 'nav-frontend-lenker';

interface Props {
    endring: Endring;
    onSaveEditedEndring: (endring: Endring) => void;
    onDeleteEndring: () => void;
}

const EndringsradView: React.FC<Props> = ({ endring, onSaveEditedEndring, onDeleteEndring }: Props): JSX.Element => {
    const intl = useIntl();
    const [endringsmodalIsOpen, setEndringsmodalIsOpen] = useState<boolean>(false);

    return (
        <li className={'inntektsendring-list__item'}>
            <div>{dateToISOFormattedDateString(endring.dato)}</div>
            <div>{endring.forklaring}</div>
            <div>
                <Lenke href="#" onClick={() => setEndringsmodalIsOpen(true)}>
                    {intlHelper(intl, 'inntektsendring.liste.knapp.endre')}
                </Lenke>
            </div>
            <div>
                <Lenke href="#" onClick={onDeleteEndring}>
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
