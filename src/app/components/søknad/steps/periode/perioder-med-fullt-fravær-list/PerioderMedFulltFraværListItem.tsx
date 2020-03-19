import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../../../types/SøknadFormData';
import { date3MonthsAgo } from '../../../../../utils/dates';
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
                        validate: validateRequiredField,
                        label: 'Fra og med',
                        name: `${SøknadFormField.perioderMedFravær}.${index}.fom` as SøknadFormField,
                        dateLimitations: {
                            minDato: date3MonthsAgo,
                            maksDato: dateToday,
                            ugyldigeTidsperioder: disabledPerioder || []
                        }
                    }}
                    toDatepickerProps={{
                        validate: validateRequiredField,
                        label: 'Til og med',
                        name: `${SøknadFormField.perioderMedFravær}.${index}.tom` as SøknadFormField,
                        dateLimitations: {
                            minDato: periode?.fom ? periode.fom : date3MonthsAgo,
                            maksDato: dateToday,
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
