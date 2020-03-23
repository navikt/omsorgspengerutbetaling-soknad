import { Fosterbarn } from '../../../types/SøknadFormData';
import { hasValue } from '../../../validation/fieldValidations';

export const isFosterbarn = (fosterbarn: Partial<Fosterbarn>): fosterbarn is Fosterbarn => {
    const { fornavn, etternavn, fødselsnummer } = fosterbarn;
    return hasValue(fornavn) && hasValue(etternavn) && hasValue(fødselsnummer);
};
