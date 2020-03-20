import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../../../../validation/constants';
import { validateDateInRange } from '../../../../../validation/fieldValidations';
import TypedFormComponents from '../../../typed-form-components/TypedFormComponents';

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
    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('rangeWrapper')}>
                <TypedFormComponents.DateIntervalPicker
                    fromDatepickerProps={{
                        validate: validateDateInRange(GYLDIG_TIDSROM, true),
                        label: 'Fra og med',
                        name: `${SøknadFormField.perioderMedFravær}.${index}.fom` as SøknadFormField,
                        dateLimitations: {
                            minDato: GYLDIG_TIDSROM.from,
                            maksDato: GYLDIG_TIDSROM.to,
                            ugyldigeTidsperioder: disabledPerioder || []
                        }
                    }}
                    toDatepickerProps={{
                        validate: validateDateInRange(GYLDIG_TIDSROM, true),
                        label: 'Til og med',
                        name: `${SøknadFormField.perioderMedFravær}.${index}.tom` as SøknadFormField,
                        dateLimitations: {
                            minDato: periode?.fom ? periode.fom : GYLDIG_TIDSROM.from,
                            maksDato: GYLDIG_TIDSROM.to,
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
