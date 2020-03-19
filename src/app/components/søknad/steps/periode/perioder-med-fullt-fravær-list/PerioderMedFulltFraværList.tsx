import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { Periode } from '../../../../../../@types/omsorgspengerutbetaling-schema';
import PerioderMedFulltFraværListItem from './PerioderMedFulltFraværListItem';

interface Props {
    perioderMedFravær: Periode[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const PeriodeMedFulltFraværList: React.FunctionComponent<Props> = ({ perioderMedFravær, onCreateNew, onRemove }) => {
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
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny periode med fullt fravær
                </Knapp>
            </FormBlock>
        </>
    );
};

export default PeriodeMedFulltFraværList;
