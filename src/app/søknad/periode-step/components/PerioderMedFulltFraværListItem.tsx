import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../../validation/constants';
import {
    validateAll, validateDateInRange, validateTomAfterFom
} from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';

interface Props {
    index: number;
    periode?: Periode;
    disabledPerioder?: Periode[];
    onRemove?: (index: number) => void;
}

const bem = bemUtils('perioderMedFulltFravarListItem');

const PerioderMedFulltFraværListItem: React.FunctionComponent<Props> = ({
    index,
    periode,
    disabledPerioder,
    onRemove
}) => {
    const tomDateRange: Partial<DateRange> = {
        from: periode?.fom ? periode.fom : GYLDIG_TIDSROM.from,
        to: GYLDIG_TIDSROM.to
    };

    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('rangeWrapper')}>
                <SøknadFormComponents.DateIntervalPicker
                    fromDatepickerProps={{
                        label: 'Fra og med',
                        validate: validateAll([validateRequiredField, validateDateInRange(GYLDIG_TIDSROM)]),
                        name: `${SøknadFormField.perioderMedFravær}.${index}.fom` as SøknadFormField,
                        dateLimitations: {
                            minDato: GYLDIG_TIDSROM.from,
                            maksDato: GYLDIG_TIDSROM.to,
                            ugyldigeTidsperioder: disabledPerioder || []
                        }
                    }}
                    toDatepickerProps={{
                        validate: validateAll([
                            validateRequiredField,
                            ...(periode?.fom ? [validateTomAfterFom(periode.fom)] : []),
                            validateDateInRange(tomDateRange)
                        ]),
                        label: 'Til og med',
                        name: `${SøknadFormField.perioderMedFravær}.${index}.tom` as SøknadFormField,
                        dateLimitations: {
                            minDato: tomDateRange.from,
                            maksDato: tomDateRange.to,
                            ugyldigeTidsperioder: disabledPerioder || []
                        }
                    }}
                />
            </div>
            {onRemove && (
                <div className={bem.element('deleteButtonWrapper')}>
                    <Knapp mini={true} htmlType="button" onClick={() => onRemove(index)} form="kompakt">
                        Fjern
                    </Knapp>
                </div>
            )}
        </div>
    );
};

export default PerioderMedFulltFraværListItem;
