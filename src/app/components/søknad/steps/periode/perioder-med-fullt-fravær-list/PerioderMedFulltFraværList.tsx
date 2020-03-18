import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../../../@types/omsorgspengerutbetaling-schema';
import PerioderMedFulltFraværListItem from './PeriodeListItem';

interface Props {
    perioderMedFravær: Periode[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const PeriodeMedFulltFraværPart: React.FunctionComponent<Props> = ({
    perioderMedFravær,
    onCreateNew: onAdd,
    onRemove
}) => {
    return (
        <>
            <div>
                {perioderMedFravær.map((periode, index) => (
                    <PerioderMedFulltFraværListItem
                        key={index}
                        index={index}
                        periode={periode}
                        onRemove={onRemove}
                        disabledPerioder={perioderMedFravær.filter((p) => p !== periode)}
                    />
                ))}
            </div>
            <FormBlock margin="l">
                <Knapp type="standard" htmlType={'button'} onClick={onAdd} mini={true}>
                    Legg til ny periode med fullt fravær
                </Knapp>
            </FormBlock>
        </>
    );
};

export default PeriodeMedFulltFraværPart;
