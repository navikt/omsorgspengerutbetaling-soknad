import React from 'react';
import { ISODateToDate, prettifyDateExtended } from '@navikt/sif-common-utils';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';

import './utenlandsoppholdSummaryItem.less';
import { UtenlandsoppholdApiData } from '../../../types/SøknadApiData';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderUtenlandsoppholdIPeriodenSummary = (opphold: UtenlandsoppholdApiData): React.ReactNode => {
    return (
        <div className={bem.block}>
            <span className={bem.element('dates')}>
                {prettifyDateExtended(ISODateToDate(opphold.fraOgMed))} -{' '}
                {prettifyDateExtended(ISODateToDate(opphold.tilOgMed))}
            </span>
            <span className={bem.element('country')}>{opphold.landnavn}</span>
        </div>
    );
};
