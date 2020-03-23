import React from 'react';
import { IntlShape } from 'react-intl';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import { Time } from 'common/types/Time';
import bemUtils from 'common/utils/bemUtils';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import { iso8601DurationToTime, timeToString } from 'common/utils/timeUtils';
import { Utbetalingsperiode, UtbetalingsperiodeMedVedlegg } from '../../../types/SøknadApiData';

export interface Props {
    intl: IntlShape;
    utbetalingsperioder: Utbetalingsperiode[];
}

const partialTimeIsTime = (partialTime: Partial<Time>): partialTime is Time => {
    return true;
};

const UtbetalingsperioderSummaryView = (props: Props) => {
    const bem = bemUtils('summaryList');

    const { intl, utbetalingsperioder } = props;

    return (
        <Box margin={'xl'}>
            <ContentWithHeader header={'Perioder det søkes utbetaling for'}>
                <div>
                    <ul className={bem.classNames(bem.block)}>
                        {utbetalingsperioder.length === 0 && <div>Ingen perioder oppgitt.</div> // TODO: Det skal ikke være mulig å komme til oppsummeringen uten å ha spesifisert noen utbetalingsperioder.
                        }
                        {utbetalingsperioder.map((utbetalingsperiode: UtbetalingsperiodeMedVedlegg, index: number) => {
                            const duration = utbetalingsperiode.lengde;

                            const maybeTime: Partial<Time> | undefined = duration
                                ? iso8601DurationToTime(duration)
                                : undefined;

                            return (
                                <li className={bem.element('item')} key={`utbetalingsperioderView${index}`}>
                                    {maybeTime && partialTimeIsTime(maybeTime) ? (
                                        <>
                                            Dato: {prettifyDate(apiStringDateToDate(utbetalingsperiode.fraOgMed))}.
                                            Antall timer: {timeToString(maybeTime, intl)}.
                                        </>
                                    ) : (
                                        <>
                                            Fra og med {prettifyDate(apiStringDateToDate(utbetalingsperiode.fraOgMed))},
                                            til og med {prettifyDate(apiStringDateToDate(utbetalingsperiode.tilOgMed))}.
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </ContentWithHeader>
        </Box>
    );
};

export default UtbetalingsperioderSummaryView;
