import * as React from 'react';
import { EndringApiData, EndringArbeidssituasjon } from '../../../types/SøknadApiData';
import intlHelper from 'common/utils/intlUtils';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from 'common/components/summary-list/SummaryList';
import { apiStringDateToDate, prettifyDateExtended } from 'common/utils/dateUtils';

export enum Arbeidstype {
    frilans = 'frilnas',
    selvstendig = 'selvstendig'
}

interface Props {
    type: Arbeidstype;
    endringArbeidssituasjon: EndringArbeidssituasjon | null;
}

export const renderEndringSummary = (endring: EndringApiData) => {
    return (
        <div>
            <div>{prettifyDateExtended(apiStringDateToDate(endring.dato))}</div>
            <div>{endring.forklaring}</div>
        </div>
    );
};

export const renderEndringArbeidssituasjonSummary = (
    harEndring: boolean,
    endringer: EndringApiData[],
    intl: IntlShape
): JSX.Element | null => {
    return harEndring ? (
        <>
            <SummaryBlock header={intlHelper(intl, 'inntektsendring.yesorno.spm')}>
                <JaNeiSvar harSvartJa={harEndring} />
            </SummaryBlock>
            {harEndring && (
                <SummaryBlock header="Endringer:">
                    <SummaryList items={endringer} itemRenderer={(endring) => renderEndringSummary(endring)} />
                </SummaryBlock>
            )}
        </>
    ) : null;
};

const EndringArbeidssituasjonSummary: React.FC<Props> = ({
    type,
    endringArbeidssituasjon
}: Props): JSX.Element | null => {
    const intl = useIntl();
    if (endringArbeidssituasjon === null) {
        return null;
    }
    switch (type) {
        case Arbeidstype.frilans:
            return renderEndringArbeidssituasjonSummary(
                endringArbeidssituasjon.harEndringFrilans,
                endringArbeidssituasjon.endringerFrilans,
                intl
            );
        case Arbeidstype.selvstendig:
            return renderEndringArbeidssituasjonSummary(
                endringArbeidssituasjon.harEndringSelvstendig,
                endringArbeidssituasjon.endringerSelvstendig,
                intl
            );
    }
};

export default EndringArbeidssituasjonSummary;
