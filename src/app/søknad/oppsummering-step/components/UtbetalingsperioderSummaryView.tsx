import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { iso8601DurationToTime, timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { FraværÅrsak, getFraværÅrsakTekstKort, timeText } from '@navikt/sif-common-forms/lib/fravær';
import { UtbetalingsperiodeApi } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import { ApiAktivitet } from '../../../types/AktivitetFravær';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

export interface Props {
    utbetalingsperioder: UtbetalingsperiodeApi[];
}

type UtbetalingsperiodeDag = Omit<
    UtbetalingsperiodeApi,
    'fraOgMed' | 'tilOgMed' | 'antallTimerPlanlagt' | 'antallTimerBorte'
> & {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
};

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
                fraværAktivitet: p.fraværAktivitet,
            };
        }
    }
    return null;
};

export const outNull = (
    maybeUtbetalingsperiodeDag: UtbetalingsperiodeDag | null
): maybeUtbetalingsperiodeDag is UtbetalingsperiodeDag => maybeUtbetalingsperiodeDag !== null;

const getFraværAktivitetString = (fraværAktivitet: ApiAktivitet[], intl: IntlShape) => {
    return fraværAktivitet.length === 2
        ? intlHelper(intl, `steg.oppsummering.fravær.aktivitet.2`, {
              aktivitet1: intlHelper(intl, `fraværAktivitet.${fraværAktivitet[0]}`),
              aktivitet2: intlHelper(intl, `fraværAktivitet.${fraværAktivitet[1]}`),
          })
        : intlHelper(intl, `steg.oppsummering.fravær.aktivitet.1`, {
              aktivitet: intlHelper(intl, `fraværAktivitet.${fraværAktivitet[0]}`),
          });
};

const renderÅrsakElement = (årsak: FraværÅrsak, intl: IntlShape): JSX.Element | null => {
    return årsak !== FraværÅrsak.ordinært ? (
        <div>
            {intlHelper(intl, 'steg.oppsummering.fravær.årsak', {
                årsak: getFraværÅrsakTekstKort(årsak, intl),
            })}
        </div>
    ) : null;
};

const renderEnkeltdagElement = (date: Date): JSX.Element => (
    <div>
        <span style={{ textTransform: 'capitalize' }}>{dayjs(date).format('dddd')}</span> {prettifyDate(date)}
    </div>
);

const renderFraværAktivitetElement = (
    aktivitet: ApiAktivitet[],
    visAktivitet: boolean,
    intl: IntlShape
): JSX.Element | null => (visAktivitet ? <div>{getFraværAktivitetString(aktivitet, intl)}</div> : null);

export const renderUtbetalingsperiodeDag = (
    dag: UtbetalingsperiodeDag,
    visAktivitet: boolean,
    intl: IntlShape
): JSX.Element => {
    const antallTimerSkulleJobbet = `${timeToDecimalTime(dag.antallTimerPlanlagt)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerPlanlagt)}`
    )}`;
    const antallTimerBorteFraJobb = `${timeToDecimalTime(dag.antallTimerBorte)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerBorte)}`
    )}`;
    return (
        <div style={{ marginBottom: '.5rem' }}>
            {renderEnkeltdagElement(apiStringDateToDate(dag.dato))}
            Skulle jobbet {antallTimerSkulleJobbet}. Borte fra jobb {antallTimerBorteFraJobb}.
            {renderÅrsakElement(dag.årsak, intl)}
            {renderFraværAktivitetElement(dag.fraværAktivitet, visAktivitet, intl)}
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

    return (
        <div style={{ marginBottom: '.5rem' }}>
            {periode.fraOgMed === periode.tilOgMed ? (
                <div>
                    {renderEnkeltdagElement(fom)}
                    {renderÅrsakElement(periode.årsak, intl)}
                    {renderFraværAktivitetElement(periode.fraværAktivitet, visAktivitet, intl)}
                </div>
            ) : (
                <div>
                    Fra og med {prettifyDate(fom)}, til og med {prettifyDate(tom)}
                    {renderÅrsakElement(periode.årsak, intl)}
                    {renderFraværAktivitetElement(periode.fraværAktivitet, visAktivitet, intl)}
                </div>
            )}
        </div>
    );
};

const harFlereFraværAktiviteter = (perioder: UtbetalingsperiodeApi[]) => {
    return uniq(flatten(perioder.map((p) => p.fraværAktivitet))).length > 1;
};

const UtbetalingsperioderSummaryView: React.FunctionComponent<Props> = ({ utbetalingsperioder = [] }) => {
    const perioder: UtbetalingsperiodeApi[] = utbetalingsperioder.filter(
        (p) => p.tilOgMed !== undefined && p.antallTimerBorte === null
    );
    const intl = useIntl();
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);
    const visAktivitetInfo = harFlereFraværAktiviteter(utbetalingsperioder);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode) => renderUtbetalingsperiode(periode, visAktivitetInfo, intl)}
                    />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={'Dager med delvis fravær'}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag) =>
                            renderUtbetalingsperiodeDag(dag, visAktivitetInfo, intl)
                        }
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
