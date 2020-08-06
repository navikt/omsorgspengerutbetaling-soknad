import React from 'react';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { SøknadFormField } from '../../../types/SøknadFormData';
import SøknadFormComponents from '../../SøknadFormComponents';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    index: number;
}

const FraværTimerSelect: React.FunctionComponent<Props> = ({ index }) => {
    const intl = useIntl();
    return (
        <SøknadFormComponents.Select
            bredde="s"
            label={intlHelper(intl, 'fravær.antallTimer')}
            name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.timer` as SøknadFormField}
            validate={validateRequiredField}>
            <option />
            <option value="0.5">
                0,5 <FormattedMessage id="fravær.time" />
            </option>
            <option value="1">
                1 <FormattedMessage id="fravær.time" />
            </option>
            <option value="1.5">
                1,5 <FormattedMessage id="fravær.time" />
            </option>
            <option value="2">
                2 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="2.5">
                2,5 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="3">
                3 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="3.5">
                3,5 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="4">
                4 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="4.5">
                4,5 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="5">
                5 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="5.5">
                5,5 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="6">
                6 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="6.5">
                6,5 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="7">
                7 <FormattedMessage id="fravær.timer" />
            </option>
            <option value="7.5">
                7,5 <FormattedMessage id="fravær.timer" />
            </option>
        </SøknadFormComponents.Select>
    );
};

export default FraværTimerSelect;
