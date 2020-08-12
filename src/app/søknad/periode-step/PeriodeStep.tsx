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
                        Reglene for hvor mange dager du selv må dekke har endret seg flere ganger på grunn av
                        koronasituasjonen:
                    </p>
                    <ul>
                        <li>Frem til og med 12. mars 2020 må du dekke de 10 første omsorgsdagene selv.</li>
                        <li>Fra 13. mars 2020 må du dekke de 3 første omsorgsdagene selv.</li>
                    </ul>
                    <p>
                        Dagene du selv skal dekke gjelder totalt for 2020. Det betyr at hvis du allerede har dekket for
                        eksempel 3 dager, gjenstår det 7 dager for deg å dekke selv i år.
                    </p>
                    <p>
                        I søknaden legger du inn alle dagene du har vært hjemme med omsorgsdager i den perioden du nå
                        søker for, inkludert dagene du selv dekker.
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
                        description={
                            <ExpandableInfo title="Hva menes med særlige smittevernhensyn?">
                                <SmittevernInfo />
                            </ExpandableInfo>
                        }
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
