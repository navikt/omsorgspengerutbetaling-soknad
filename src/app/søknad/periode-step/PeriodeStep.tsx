import * as React from 'react';
import { useIntl } from 'react-intl';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import SmittevernInfo from '../../components/information/SmittevernInfo';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { fraværDagToFraværDateRange, validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær';
import { validateAll } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import { GYLDIG_TIDSROM } from '../../validation/constants';
import './periodeStep.less';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { harPerioderMedFravær, harDagerMedDelvisFravær, perioder_harVærtIUtlandet } = values;

    const intl = useIntl();
    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;

    const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
        const cleanedValues = { ...valuesToBeCleaned };
        if (harDagerMedDelvisFravær === YesOrNo.NO) {
            cleanedValues.fraværDager = [];
        }
        if (harPerioderMedFravær === YesOrNo.NO) {
            cleanedValues.fraværPerioder = [];
        }
        return cleanedValues;
    };

    return (
        <SøknadStep
            id={StepID.PERIODE}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={kanIkkeFortsette === false}>
            <FormBlock>
                <CounsellorPanel>
                    <p>
                        Nå skal du legge inn dagene du har hatt fravær fra jobb fordi du har vært hjemme med
                        omsorgsdager.
                    </p>

                    <p>
                        <strong>Hvis du søker for første gang i år</strong>, kan du få utbetalt omsorgspenger fra den 4.
                        dagen du har vært hjemme. De tre første dagene må du dekke selv. Når du legger inn dagene du har
                        vært hjemme, skal du også legge inn de tre første dagene.
                    </p>
                    <p>
                        <strong>Hvis du søker på nytt i år</strong>, og allerede har dekket de tre første dagene, skal
                        du ikke dekke de igjen. Da legger du inn dagene du har vært hjemme med omsorgsdager i denne
                        søknadsperioden.
                    </p>

                    <p>Du kan søke om utbetaling for opptil 3 måneder tilbake i tid, og fram til dagens dato.</p>
                    <p>
                        Barnehagen eller skolen er alltid stengt på røde dager. Det vil si at for røde dager kan du kun
                        få utbetalt omsorgspenger hvis du har hatt fravær fra jobb fordi barnet eller barnepasser var
                        syk.
                    </p>
                </CounsellorPanel>
            </FormBlock>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harPerioderMedFravær}
                    legend="Har du hatt hele dager med fravær fra jobb?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED FULLT FRAVÆR*/}
            {harPerioderMedFravær === YesOrNo.YES && (
                <>
                    <FormBlock paddingBottom={'l'} margin={'l'}>
                        <FraværPerioderListAndDialog<SøknadFormField>
                            name={SøknadFormField.fraværPerioder}
                            minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                            maxDate={GYLDIG_TIDSROM.to || dateToday}
                            validate={validateAll([
                                validateRequiredList,
                                validateNoCollisions(
                                    values[SøknadFormField.fraværDager],
                                    values[SøknadFormField.fraværPerioder]
                                )
                            ])}
                            labels={{
                                addLabel: 'Legg til ny periode med fullt fravær',
                                modalTitle: 'Fravær hele dager'
                            }}
                            dateRangesToDisable={[
                                ...values.fraværPerioder,
                                ...values.fraværDager.map(fraværDagToFraværDateRange)
                            ]}
                            helgedagerIkkeTillat={true}
                        />
                        <FormBlock margin={'l'}>
                            <ExpandableInfo title="Hvorfor kan jeg ikke velge lørdag eller søndag?">
                                Du kan kun få utbetalt omsorgspenger for hverdager, selv om du jobber lørdag eller
                                søndag. Derfor kan du ikke velge lørdag eller søndag som start- eller sluttdato i
                                perioden du legger inn.
                            </ExpandableInfo>
                        </FormBlock>
                    </FormBlock>
                </>
            )}
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harDagerMedDelvisFravær}
                    legend="Har du hatt dager med delvis fravær fra jobb?"
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED DELVIS FRAVÆR*/}
            {harDagerMedDelvisFravær === YesOrNo.YES && (
                <>
                    <FormBlock margin={'l'} paddingBottom={'l'}>
                        <FraværDagerListAndDialog<SøknadFormField>
                            name={SøknadFormField.fraværDager}
                            minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                            maxDate={GYLDIG_TIDSROM.to || dateToday}
                            validate={validateAll([
                                validateRequiredList,
                                validateNoCollisions(
                                    values[SøknadFormField.fraværDager],
                                    values[SøknadFormField.fraværPerioder]
                                )
                            ])}
                            labels={{
                                addLabel: 'Legg til ny dag med delvis fravær',
                                modalTitle: 'Fravær deler av dag'
                            }}
                            dateRangesToDisable={[
                                ...values.fraværDager.map(fraværDagToFraværDateRange),
                                ...values.fraværPerioder
                            ]}
                            helgedagerIkkeTillatt={true}
                            maksArbeidstidPerDag={24}
                        />
                        <FormBlock margin={'l'}>
                            <ExpandableInfo title="Hvorfor kan jeg ikke velge lørdag eller søndag?">
                                Du kan kun få utbetalt omsorgspenger for hverdager, selv om du jobber lørdag eller
                                søndag. Derfor kan du ikke legge inn delvis fravær på lørdager eller søndager.
                            </ExpandableInfo>
                        </FormBlock>
                    </FormBlock>
                </>
            )}

            {kanIkkeFortsette && (
                <FormBlock margin="xxl">
                    <AlertStripeAdvarsel>Du må velge én av situasjonene over. </AlertStripeAdvarsel>
                </FormBlock>
            )}

            {kanIkkeFortsette === false && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.hemmeligJaNeiSporsmal}
                        legend={intlHelper(intl, 'steg.en.smittevern.sporsmal')}
                        validate={validateYesOrNoIsAnswered}
                        info={<SmittevernInfo />}
                    />
                </FormBlock>
            )}

            {kanIkkeFortsette === false && (
                <>
                    <FormBlock margin={'xl'}>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.perioder_harVærtIUtlandet}
                            legend={intlHelper(
                                intl,
                                'step.periode.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                            )}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {perioder_harVærtIUtlandet === YesOrNo.YES && (
                        <FormBlock margin="l">
                            <BostedUtlandListAndDialog<SøknadFormField>
                                name={SøknadFormField.perioder_utenlandsopphold}
                                minDate={date1YearAgo}
                                maxDate={date1YearFromNow}
                                labels={{
                                    addLabel: 'Legg til nytt utenlandsopphold',
                                    modalTitle: 'Utenlandsopphold siste 12 måneder'
                                }}
                                validate={validateRequiredList}
                            />
                        </FormBlock>
                    )}
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.har_søkt_andre_utbetalinger}
                            legend={intlHelper(intl, 'step.periode.har_søkt_andre_utbetalinger.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                        {values.har_søkt_andre_utbetalinger === YesOrNo.YES && (
                            <FormBlock>
                                <SøknadFormComponents.CheckboxPanelGroup
                                    name={SøknadFormField.andre_utbetalinger}
                                    legend={intlHelper(intl, 'step.periode.hvilke_utbetalinger.spm')}
                                    checkboxes={[
                                        {
                                            id: AndreUtbetalinger.dagpenger,
                                            value: AndreUtbetalinger.dagpenger,
                                            label: intlHelper(intl, 'andre_utbetalinger.dagpenger')
                                        },
                                        {
                                            id: AndreUtbetalinger.sykepenger,
                                            value: AndreUtbetalinger.sykepenger,
                                            label: intlHelper(intl, 'andre_utbetalinger.sykepenger')
                                        },
                                        {
                                            id: AndreUtbetalinger.midlertidigkompensasjonsnfri,
                                            value: AndreUtbetalinger.midlertidigkompensasjonsnfri,
                                            label: intlHelper(intl, 'andre_utbetalinger.midlertidigkompensasjonsnfri')
                                        }
                                    ]}
                                    validate={validateRequiredList}
                                />
                            </FormBlock>
                        )}
                    </FormBlock>
                </>
            )}
        </SøknadStep>
    );
};

export default PeriodeStep;
