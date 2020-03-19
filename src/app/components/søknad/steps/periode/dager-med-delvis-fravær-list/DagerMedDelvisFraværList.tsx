import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag } from '../../../../../../@types/omsorgspengerutbetaling-schema';
import DagerMedDelvisFraværListItem from './DagerMedDelvisFraværListItem';

interface Props {
    dagerMedDelvisFravær: FraværDelerAvDag[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const DagerMedDelvisFraværList: React.FunctionComponent<Props> = ({ dagerMedDelvisFravær, onRemove, onCreateNew }) => {
    return (
        <>
            <div>
                {dagerMedDelvisFravær.map((dag, index) => (
                    <DagerMedDelvisFraværListItem
                        key={index}
                        index={index}
                        dag={dag}
                        onRemove={onRemove}
                        disabledDager={dagerMedDelvisFravær.filter((d) => d !== dag)}
                    />
                ))}
            </div>
            <FormBlock margin="l">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny dag med delvis fravær
                </Knapp>
            </FormBlock>
        </>
    );
};
export default DagerMedDelvisFraværList;
