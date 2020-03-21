import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../types/SøknadFormData';
import {
    GYLDIG_TIDSROM, MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG, MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG
} from '../../../validation/constants';
import {
    validateAll, validateDateInRange, validateHours
} from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';

interface Props {
    index: number;
    dag: FraværDelerAvDag;
    disabledDager?: FraværDelerAvDag[];
    disabledPerioder?: Periode[];
    onRemove?: (index: number) => void;
}

const bem = bemUtils('dagerMedDelvisFravarListItem');

const DagerMedDelvisFraværListItem: React.FunctionComponent<Props> = ({ index, dag, disabledDager, onRemove }) => {
    const ugyldigeTidsperioder = disabledDager
        ?.filter((d) => d.dato)
        .map((d) => ({
            fom: d.dato,
            tom: d.dato
        }));
    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('dateWrapper')}>
                <SøknadFormComponents.DatePicker
                    label="Dato"
                    validate={validateAll([validateRequiredField, validateDateInRange(GYLDIG_TIDSROM)])}
                    name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.dato` as SøknadFormField}
                    dateLimitations={{
                        minDato: GYLDIG_TIDSROM.from,
                        maksDato: GYLDIG_TIDSROM.to,
                        ugyldigeTidsperioder
                    }}
                />
            </div>
            <div className={bem.element('hoursWrapper')}>
                <SøknadFormComponents.Input
                    inputMode="decimal"
                    label={'Timer'}
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

export default DagerMedDelvisFraværListItem;
