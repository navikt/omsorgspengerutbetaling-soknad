import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { SøknadFormField } from '../../../types/SøknadFormData';
import { validateDagerMedFravær } from '../../../validation/fieldValidations';
import SøknadFormComponents from '../../SøknadFormComponents';
import DagerMedDelvisFraværListItem from './DagerMedDelvisFraværListItem';
import { FormattedMessage } from 'react-intl';

interface Props {
    dagerMedDelvisFravær: FraværDelerAvDag[];
    perioderMedFravær: Periode[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const DagerMedDelvisFraværList: React.FunctionComponent<Props> = ({
    dagerMedDelvisFravær,
    perioderMedFravær,
    onRemove,
    onCreateNew
}) => {
    return (
        <>
            <SøknadFormComponents.InputGroup
                className={'periodelistGroup'}
                name={SøknadFormField.dagerMedDelvisFraværGroup}
                validate={() => validateDagerMedFravær(dagerMedDelvisFravær, perioderMedFravær)}>
                {dagerMedDelvisFravær.map((dag, index) => (
                    <DagerMedDelvisFraværListItem
                        key={index}
                        index={index}
                        dag={dag}
                        onRemove={onRemove}
                        disabledDager={dagerMedDelvisFravær.filter((d) => d !== dag)}
                    />
                ))}
            </SøknadFormComponents.InputGroup>
            <FormBlock margin="m">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    <FormattedMessage id="step.periode.leggTilDagMedDelvisFravær" />
                </Knapp>
            </FormBlock>
        </>
    );
};
export default DagerMedDelvisFraværList;
