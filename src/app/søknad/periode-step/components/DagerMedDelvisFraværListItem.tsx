import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../../validation/constants';
import { validateAll, validateDateInRange } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import FraværTimerSelect from './FraværTimerSelect';
import { validateFraværDelerAvDagNotWeekend } from '../../../utils/periodeUtils';
import { IntlShape, useIntl, FormattedMessage } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    index: number;
    dag: FraværDelerAvDag;
    disabledDager?: FraværDelerAvDag[];
    disabledPerioder?: Periode[];
    onRemove?: (index: number) => void;
}

const bem = bemUtils('dagerMedDelvisFravarListItem');

export const pluralize = (count: number, single: string, other: string) => (count === 1 ? single : other);

const getFjernLabel = (intl: IntlShape, dato?: Date, timer?: number): string => {
    const timerTekst: string | undefined = timer ? `${timer} ${intlHelper(intl, 'timer', { timer })}` : undefined;

    if (dato && timerTekst) {
        return intlHelper(intl, 'fravær.delvis.fjern.fjernDag', { dato: prettifyDate(dato), timer: timerTekst });
    }
    if (dato) {
        return intlHelper(intl, 'fravær.delvis.fjern.fjernDagUtenTimer', { dato: prettifyDate(dato) });
    }
    if (timerTekst) {
        return intlHelper(intl, 'fravær.delvis.fjern.fjernTimer', { timer: timerTekst });
    }
    return intlHelper(intl, 'fravær.delvis.fjern.fjernUtenDagOgTimer');
};

const DagerMedDelvisFraværListItem: React.FunctionComponent<Props> = ({ index, dag, disabledDager, onRemove }) => {
    const intl = useIntl();
    const ugyldigeTidsperioder = disabledDager
        ?.filter((d) => d.dato)
        .map((d) => ({
            from: d.dato,
            to: d.dato
        }));
    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('dateWrapper')}>
                <SøknadFormComponents.DatePicker
                    label={intlHelper(intl, 'Dato')}
                    validate={validateAll([
                        validateRequiredField,
                        validateDateInRange(GYLDIG_TIDSROM),
                        validateFraværDelerAvDagNotWeekend
                    ])}
                    name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.dato` as SøknadFormField}
                    minDate={GYLDIG_TIDSROM.from}
                    maxDate={GYLDIG_TIDSROM.to}
                    disabledDateRanges={ugyldigeTidsperioder}
                    disableWeekend={true}
                />
            </div>
            <div className={bem.element('hoursWrapper')}>
                <FraværTimerSelect index={index} />
            </div>
            {onRemove && (
                <div className={bem.element('deleteButtonWrapper')}>
                    <Knapp
                        mini={true}
                        htmlType="button"
                        onClick={() => onRemove(index)}
                        form="kompakt"
                        aria-label={getFjernLabel(intl, dag.dato, dag.timer)}>
                        <FormattedMessage id="list.fjernKnapp" />
                    </Knapp>
                </div>
            )}
        </div>
    );
};

export default DagerMedDelvisFraværListItem;
