import React from 'react';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG, MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG } from '../../../validation/constants';
import { validateAll, validateHours } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

interface Props {
    index: number;
}

const FraværTimerInput: React.FunctionComponent<Props> = ({ index }) => {
    const intl = useIntl();
    return (
        <SøknadFormComponents.Input
            inputMode="decimal"
            label={intlHelper(intl, 'fravær.timer.label')}
            name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.timer` as SøknadFormField}
            bredde="XS"
            min={MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG}
            max={MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG}
            validate={validateAll([
                validateRequiredField,
                validateHours({
                    min: MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG,
                    max: MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG
                })
            ])}
        />
    );
};

export default FraværTimerInput;
