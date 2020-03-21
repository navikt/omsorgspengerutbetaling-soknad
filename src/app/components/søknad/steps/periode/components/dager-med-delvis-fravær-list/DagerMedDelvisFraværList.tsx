import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag } from '../../../../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../../../../types/SøknadFormData';
import { validateDagerMedFravær } from '../../../../../../validation/fieldValidations';
import TypedFormComponents from '../../../../typed-form-components/TypedFormComponents';
import DagerMedDelvisFraværListItem from './DagerMedDelvisFraværListItem';

interface Props {
    dagerMedDelvisFravær: FraværDelerAvDag[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const DagerMedDelvisFraværList: React.FunctionComponent<Props> = ({ dagerMedDelvisFravær, onRemove, onCreateNew }) => {
    return (
        <>
            <TypedFormComponents.InputGroup
                className={'periodelistGroup'}
                name={SøknadFormField.dagerMedDelvisFraværGroup}
                validate={() => validateDagerMedFravær(dagerMedDelvisFravær)}>
                {dagerMedDelvisFravær.map((dag, index) => (
                    <DagerMedDelvisFraværListItem
                        key={index}
                        index={index}
                        dag={dag}
                        onRemove={onRemove}
                        disabledDager={dagerMedDelvisFravær.filter((d) => d !== dag)}
                    />
                ))}
            </TypedFormComponents.InputGroup>
            <FormBlock margin="m">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny dag med delvis fravær
                </Knapp>
            </FormBlock>
        </>
    );
};
export default DagerMedDelvisFraværList;
