import React from 'react';

interface Props {}

const SmittevernInfo = ({}: Props) => (
    <div className={'smittevern-info'}>
        Hvis barnehagen eller skolen som ditt barn går i åpner, men du må være hjemme med barnet på grunn av{' '}
        <strong>særlige smittevernhensyn</strong> kan du bruke omsorgsdager. Det kan være smittevernhensyn til barnet
        eller andre familiemedlemmer som barnet bor med. Dette gjelder i forbindelse med koronaviruset i perioden 20.
        april fram til og med 31. desember 2020.
    </div>
);

export default SmittevernInfo;
