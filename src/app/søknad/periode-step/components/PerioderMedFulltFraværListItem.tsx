import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../../validation/constants';
import { validateAll, validateDateInRange, validateTomAfterFom } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import { validatePeriodeNotWeekend } from '../../../utils/periodeUtils';
import { useIntl, FormattedMessage } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Form } from 'formik';

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
    const intl = useIntl();
    const tomDateRange: Partial<DateRange> = {
        from: periode?.fom ? periode.fom : GYLDIG_TIDSROM.from,
        to: GYLDIG_TIDSROM.to
    };

    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('rangeWrapper')}>
                <SøknadFormComponents.DateIntervalPicker
                    fromDatepickerProps={{
                        label: intlHelper(intl, 'datovelger.fom'),
                        validate: validateAll([
                            validateRequiredField,
                            validateDateInRange(GYLDIG_TIDSROM),
                            validatePeriodeNotWeekend
                        ]),
                        name: `${SøknadFormField.perioderMedFravær}.${index}.fom` as SøknadFormField,

                        minDate: GYLDIG_TIDSROM.from,
                        maxDate: GYLDIG_TIDSROM.to,
                        disabledDateRanges: (disabledPerioder || []).map((p) => ({ from: p.fom, to: p.tom })),
                        disableWeekend: true
                    }}
                    toDatepickerProps={{
                        validate: validateAll([
                            validateRequiredField,
                            ...(periode?.fom ? [validateTomAfterFom(periode.fom)] : []),
                            validateDateInRange(tomDateRange),
                            validatePeriodeNotWeekend
                        ]),
                        label: intlHelper(intl, 'datovelger.tom'),
                        name: `${SøknadFormField.perioderMedFravær}.${index}.tom` as SøknadFormField,
                        minDate: tomDateRange.from,
                        maxDate: tomDateRange.to,
                        disabledDateRanges: (disabledPerioder || []).map((p) => ({ from: p.fom, to: p.tom })),
                        disableWeekend: true
                    }}
                />
            </div>
            {onRemove && (
                <div className={bem.element('deleteButtonWrapper')}>
                    <Knapp mini={true} htmlType="button" onClick={() => onRemove(index)} form="kompakt">
                        <FormattedMessage id="list.fjernKnapp" />
                    </Knapp>
                </div>
            )}
        </div>
    );
};

export default PerioderMedFulltFraværListItem;
