import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { apiStringDateToDate, prettifyDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { iso8601DurationToTime, timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { FraværÅrsak, getFraværÅrsakTekstKort, timeText } from '@navikt/sif-common-forms/lib/fravær';
import { UtbetalingsperiodeApi } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';
import dayjs from 'dayjs';
import uniqBy from 'lodash/uniqBy';

export interface Props {
    utbetalingsperioder: UtbetalingsperiodeApi[];
}

interface UtbetalingsperiodeDag {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
    årsak: FraværÅrsak;
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
                antallTimerBorte: antallTimerBorteTime,
                årsak: p.årsak,
            };
        }
    }
    return null;
};

export const outNull = (
    maybeUtbetalingsperiodeDag: UtbetalingsperiodeDag | null
): maybeUtbetalingsperiodeDag is UtbetalingsperiodeDag => maybeUtbetalingsperiodeDag !== null;

export const renderUtbetalingsperiodeDag = (dag: UtbetalingsperiodeDag, intl: IntlShape): JSX.Element => {
    const antallTimerSkulleJobbet = `${timeToDecimalTime(dag.antallTimerPlanlagt)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerPlanlagt)}`
    )}`;
    const antallTimerBorteFraJobb = `${timeToDecimalTime(dag.antallTimerBorte)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerBorte)}`
    )}`;
    return (
        <div>
            {prettifyDateExtended(apiStringDateToDate(dag.dato))}: Skulle jobbet {antallTimerSkulleJobbet}. Borte fra
            jobb {antallTimerBorteFraJobb}.
            {dag.årsak !== FraværÅrsak.ordinært && <div>Årsak: {getFraværÅrsakTekstKort(dag.årsak, intl)}</div>}
        </div>
    );
};

const renderUtbetalingsperiode = (
    periode: UtbetalingsperiodeApi,
    visAktivitet: boolean,
    intl: IntlShape
): JSX.Element => {
    const fom = apiStringDateToDate(periode.fraOgMed);
    const tom = apiStringDateToDate(periode.tilOgMed);
    const fomDag = dayjs(fom).format('dddd');
    // const aktivitet = {};

    return periode.fraOgMed === periode.tilOgMed ? (
        <div>
            <span style={{ textTransform: 'capitalize' }}>{fomDag}</span> {prettifyDate(fom)}
            {visAktivitet && periode.fraværAktivitet}
        </div>
    ) : (
        <div>
            Fra og med {prettifyDate(fom)}, til og med {prettifyDate(tom)}
            {periode.årsak !== FraværÅrsak.ordinært && <div>Årsak: {getFraværÅrsakTekstKort(periode.årsak, intl)}</div>}
        </div>
    );
};

const harFlereFraværAktiviteter = (perioder: UtbetalingsperiodeApi[]) => {
    return uniqBy(perioder, (periode) => periode.fraværAktivitet).length === 2;
};

const UtbetalingsperioderSummaryView: React.FunctionComponent<Props> = ({ utbetalingsperioder = [] }) => {
    const perioder: UtbetalingsperiodeApi[] = utbetalingsperioder.filter(
        (p) => p.tilOgMed !== undefined && p.antallTimerBorte === null
    );
    const intl = useIntl();
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);
    const harUlikeAktiviteter = harFlereFraværAktiviteter(utbetalingsperioder);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode) => renderUtbetalingsperiode(periode, harUlikeAktiviteter, intl)}
                    />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={'Dager med delvis fravær'}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag) => renderUtbetalingsperiodeDag(dag, intl)}
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
