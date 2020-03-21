import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../../types/SøknadFormData';
import { validatePerioderMedFravær } from '../../../../validation/fieldValidations';
import TypedFormComponents from '../../../typed-form-components/TypedFormComponents';
import PerioderMedFulltFraværListItem from './PerioderMedFulltFraværListItem';

interface Props {
    perioderMedFravær: Periode[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const PeriodeMedFulltFraværList: React.FunctionComponent<Props> = ({ perioderMedFravær, onCreateNew, onRemove }) => {
    // const tomListe = perioderMedFravær.length === 0;
    return (
        <>
            <TypedFormComponents.InputGroup
                className="periodelistGroup"
                // legend={tomListe ? undefined : 'Perioder med fullt fravær'}
                name={SøknadFormField.perioderMedFraværGroup}
                validate={() => validatePerioderMedFravær(perioderMedFravær)}>
                {perioderMedFravær.map((periode, index) => (
                    <PerioderMedFulltFraværListItem
                        key={index}
                        index={index}
                        periode={periode}
                        onRemove={onRemove}
                        disabledPerioder={perioderMedFravær.filter((p) => p !== periode)}
                    />
                ))}
            </TypedFormComponents.InputGroup>
            <FormBlock margin="m">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny periode med fullt fravær
                </Knapp>
            </FormBlock>
        </>
    );
};

export default PeriodeMedFulltFraværList;
