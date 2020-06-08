import React from 'react';
import { useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from 'common/types/Time';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import { iso8601DurationToTime, timeToString } from 'common/utils/timeUtils';
import { UtbetalingsperiodeApi } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';

export interface Props {
    utbetalingsperioder: UtbetalingsperiodeApi[];
}

interface UtbetalingsperiodeDag {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
}

export const isTime = (value: any): value is Time => {
    return value && value.hours !== undefined && value.minutes !== undefined;
};

export const isUtbetalingsperiodeDag = (p: any): p is UtbetalingsperiodeDag =>
    p && p.fraOgMed && p.antallTimerBorte !== null && p.antallTimerPlanlagt !== null;

export const toMaybeUtbetalingsperiodeDag = (p: UtbetalingsperiodeApi): UtbetalingsperiodeDag | null => {
    if (isUtbetalingsperiodeDag(p)) {
        const antallTimerPlanlagtTime: Partial<Time> | undefined = iso8601DurationToTime(p.antallTimerPlanlagt);
        const antallTimerBorteTime = iso8601DurationToTime(p.antallTimerBorte);
        if (isTime(antallTimerPlanlagtTime) && isTime(antallTimerBorteTime)) {
            return {
                dato: p.fraOgMed,
                antallTimerPlanlagt: antallTimerPlanlagtTime,
                antallTimerBorte: antallTimerBorteTime
            };
        }
    }
    return null;
};

export const outNull = (
    maybeUtbetalingsperiodeDag: UtbetalingsperiodeDag | null
): maybeUtbetalingsperiodeDag is UtbetalingsperiodeDag => maybeUtbetalingsperiodeDag !== null;

function UtbetalingsperioderSummaryView({ utbetalingsperioder = [] }: Props) {
    const intl = useIntl();

    const perioder: UtbetalingsperiodeApi[] = utbetalingsperioder.filter(
        (p) => p.tilOgMed !== undefined && p.antallTimerBorte === null
    );
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode: UtbetalingsperiodeApi) => (
                            <span>
                                Fra og med {prettifyDate(apiStringDateToDate(periode.fraOgMed))}, til og med{' '}
                                {prettifyDate(apiStringDateToDate(periode.tilOgMed))}
                            </span>
                        )}
                    />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={'Dager med delvis fravær'}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag) => (
                            <span>
                                {prettifyDate(apiStringDateToDate(dag.dato))}: Skulle jobbet:{' '}
                                {timeToString(dag.antallTimerPlanlagt, intl, true)}. Borte fra jobb:{' '}
                                {timeToString(dag.antallTimerBorte, intl, true)}
                            </span>
                        )}
                    />
                </SummaryBlock>
            )}
        </>
    );
}

export default UtbetalingsperioderSummaryView;
