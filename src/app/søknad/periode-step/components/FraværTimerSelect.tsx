import React from 'react';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { SøknadFormField } from '../../../types/SøknadFormData';
import SøknadFormComponents from '../../SøknadFormComponents';

interface Props {
    index: number;
}

const FraværTimerSelect: React.FunctionComponent<Props> = ({ index }) => (
    <SøknadFormComponents.Select
        bredde="s"
        label="Antall timer"
        name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.timer` as SøknadFormField}
        validate={validateRequiredField}>
        <option />
        <option value="0.5">0,5 time</option>
        <option value="1">1 time</option>
        <option value="1.5">1,5 time</option>
        <option value="2">2 timer</option>
        <option value="2.5">2,5 timer</option>
        <option value="3">3 timer</option>
        <option value="3.5">3,5 timer</option>
        <option value="4">4 timer</option>
        <option value="4.5">4,5 timer</option>
        <option value="5">5 timer</option>
        <option value="5.5">5,5 timer</option>
        <option value="6">6 timer</option>
        <option value="6.5">6,5 timer</option>
        <option value="7">7 timer</option>
        <option value="7.5">7,5 timer</option>
    </SøknadFormComponents.Select>
);

export default FraværTimerSelect;
