import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { date3YearsAgo } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikDatepicker, FormikInput } from '@navikt/sif-common-formik/lib';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag } from '../../../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../../../types/SøknadFormData';

interface Props {
    index: number;
    dag: FraværDelerAvDag;
    disabledDager?: FraværDelerAvDag[];
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
                <FormikDatepicker
                    label="Dato"
                    validate={() => null}
                    name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.dato`}
                    dateLimitations={{
                        minDato: date3YearsAgo,
                        maksDato: undefined,
                        ugyldigeTidsperioder
                    }}
                />
            </div>
            <div className={bem.element('hoursWrapper')}>
                <FormikInput
                    inputMode="decimal"
                    label={'Timer'}
                    name={`${SøknadFormField.dagerMedDelvisFravær}.${index}.timer`}
                    bredde="XS"
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
