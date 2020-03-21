import React from 'react';
import bemUtils from 'common/utils/bemUtils';
import { apiStringDateToDate, prettifyDateExtended } from 'common/utils/dateUtils';
import { UtenlandsoppholdApiData } from 'app/types/SøknadApiData';
import './utenlandsoppholdSummaryItem.less';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderUtenlandsoppholdSummary = (opphold: UtenlandsoppholdApiData): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
        </span>
        <span className={bem.element('country')}>{opphold.landnavn}</span>
    </div>
);
