import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { validatePerioderMedFravær } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import PerioderMedFulltFraværListItem from './PerioderMedFulltFraværListItem';

interface Props {
    perioderMedFravær: Periode[];
    dagerMedGradvisFravær: FraværDelerAvDag[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const PeriodeMedFulltFraværList: React.FunctionComponent<Props> = ({
    perioderMedFravær,
    dagerMedGradvisFravær,
    onCreateNew,
    onRemove
}) => {
    return (
        <>
            <SøknadFormComponents.InputGroup
                className="periodelistGroup"
                name={SøknadFormField.perioderMedFraværGroup}
                validate={() => validatePerioderMedFravær(perioderMedFravær, dagerMedGradvisFravær)}>
                {perioderMedFravær.map((periode, index) => (
                    <PerioderMedFulltFraværListItem
                        key={index}
                        index={index}
                        periode={periode}
                        onRemove={onRemove}
                        disabledPerioder={perioderMedFravær.filter((p) => p !== periode)}
                    />
                ))}
            </SøknadFormComponents.InputGroup>
            <FormBlock margin="m">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny periode med fullt fravær
                </Knapp>
            </FormBlock>
        </>
    );
};

export default PeriodeMedFulltFraværList;
