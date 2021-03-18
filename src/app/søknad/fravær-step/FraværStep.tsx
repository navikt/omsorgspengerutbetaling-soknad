import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import {
    fraværDagToFraværDateRange,
    fraværPeriodeToDateRange,
    validateNoCollisions,
} from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { validateAll } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../validation/constants';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import './fraværStep.less';

const FraværStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
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
    const getInfoPanel = () => {
        return (
            <>
                <p>
                    <FormattedMessage id="step.fravaer.info2021.1" />
                    {/* <Note>[informasjon om at en kun kan søke innenfor samme kalenderår i en søknad]</Note> */}
                </p>
                <p>
                    <FormattedMessage id="step.fravaer.info2021.3" />
                </p>
            </>
        );
    };
    return (
        <SøknadStep
            id={StepID.FRAVÆR}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={kanIkkeFortsette === false && values.årstall !== undefined}>
            <FormBlock>
                <CounsellorPanel>{getInfoPanel()}</CounsellorPanel>
            </FormBlock>

            <FormBlock>
                <SøknadFormComponents.RadioPanelGroup
                    legend="Skal du søke om utbetaling for fravær i 2020 eller 2021?"
                    description={
                        <ExpandableInfo title={'Hvorfor kan jeg kun søke innenfor ett kalenderår?'}>
                            Informasjon om dette
                        </ExpandableInfo>
                    }
                    useTwoColumns={true}
                    name={SøknadFormField.årstall}
                    radios={[
                        {
                            label: '2020',
                            value: '2020',
                        },
                        {
                            label: '2021',
                            value: '2021',
                        },
                    ]}
                />
                {values.årstall === '2020' && (
                    <FormBlock>
                        <AlertStripeInfo>
                            <Element tag="h3">{intlHelper(intl, 'step.fravaer.info2020.nedtrekk.title')}</Element>
                            <p>
                                <FormattedMessage id="step.fravaer.info2020.nedtrekk.1" />
                            </p>
                            <ul>
                                <li>
                                    <FormattedMessage id="step.fravaer.info2020.nedtrekk.list.1" />
                                </li>
                                <li>
                                    <FormattedMessage id="step.fravaer.info2020.nedtrekk.list.2" />
                                </li>
                                <li>
                                    <FormattedMessage id="step.fravaer.info2020.nedtrekk.list.3" />
                                </li>
                            </ul>
                            <p>
                                <FormattedMessage id="step.fravaer.info2020.nedtrekk.2" />
                            </p>
                        </AlertStripeInfo>
                    </FormBlock>
                )}
                {values.årstall === '2021' && (
                    <FormBlock>
                        <AlertStripeInfo>
                            <Element tag="h3">{intlHelper(intl, 'step.fravaer.info2021.nedtrekk.title')}</Element>
                            <p>
                                <FormattedMessage id="step.fravaer.info2021.2" />
                            </p>
                        </AlertStripeInfo>
                    </FormBlock>
                )}
            </FormBlock>
            {values.årstall !== undefined && (
                <>
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.harPerioderMedFravær}
                            legend={intlHelper(intl, 'step.fravaer.spm.harPerioderMedFravær')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>

                    {/* DAGER MED FULLT FRAVÆR*/}
                    {harPerioderMedFravær === YesOrNo.YES && (
                        <>
                            <FormBlock margin="xl">
                                <FraværPerioderListAndDialog<SøknadFormField>
                                    name={SøknadFormField.fraværPerioder}
                                    periodeDescription={
                                        <ExpandableInfo
                                            title={intlHelper(
                                                intl,
                                                'step.fravaer.harPerioderMedFravær.info.ikkeHelg.tittel'
                                            )}>
                                            <FormattedMessage id="step.fravaer.harPerioderMedFravær.info.ikkeHelg.tekst" />
                                        </ExpandableInfo>
                                    }
                                    minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                                    maxDate={GYLDIG_TIDSROM.to || dateToday}
                                    validate={validateAll([
                                        validateRequiredList,
                                        validateNoCollisions(
                                            values[SøknadFormField.fraværDager],
                                            values[SøknadFormField.fraværPerioder]
                                        ),
                                    ])}
                                    labels={{
                                        listTitle: 'Registrerte perioder med fravær',
                                        addLabel: intlHelper(intl, 'step.fravaer.harPerioderMedFravær.addLabel'),
                                        modalTitle: intlHelper(intl, 'step.fravaer.harPerioderMedFravær.modalTitle'),
                                    }}
                                    dateRangesToDisable={[
                                        ...values.fraværPerioder.map(fraværPeriodeToDateRange),
                                        ...values.fraværDager.map(fraværDagToFraværDateRange),
                                    ]}
                                    helgedagerIkkeTillat={true}
                                />
                            </FormBlock>
                        </>
                    )}
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.harDagerMedDelvisFravær}
                            legend={intlHelper(intl, 'step.fravaer.spm.harDagerMedDelvisFravær')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {/* DAGER MED DELVIS FRAVÆR*/}
                    {harDagerMedDelvisFravær === YesOrNo.YES && (
                        <>
                            <FormBlock margin="l">
                                <FraværDagerListAndDialog<SøknadFormField>
                                    name={SøknadFormField.fraværDager}
                                    dagDescription={
                                        <ExpandableInfo
                                            title={intlHelper(
                                                intl,
                                                'step.fravaer.harPerioderMedFravær.info.ikkeHelg.tittel'
                                            )}>
                                            <FormattedMessage id="step.fravaer.harPerioderMedFravær.info.ikkeHelg.tekst" />
                                        </ExpandableInfo>
                                    }
                                    minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                                    maxDate={GYLDIG_TIDSROM.to || dateToday}
                                    validate={validateAll([
                                        validateRequiredList,
                                        validateNoCollisions(
                                            values[SøknadFormField.fraværDager],
                                            values[SøknadFormField.fraværPerioder]
                                        ),
                                    ])}
                                    labels={{
                                        addLabel: intlHelper(intl, 'step.fravaer.harDagerMedDelvisFravær.addLabel'),
                                        modalTitle: intlHelper(intl, 'step.fravaer.harDagerMedDelvisFravær.modalTitle'),
                                    }}
                                    dateRangesToDisable={[
                                        ...values.fraværDager.map(fraværDagToFraværDateRange),
                                        ...values.fraværPerioder.map(fraværPeriodeToDateRange),
                                    ]}
                                    helgedagerIkkeTillatt={true}
                                    maksArbeidstidPerDag={24}
                                />
                            </FormBlock>
                        </>
                    )}

                    {kanIkkeFortsette && (
                        <FormBlock margin="xxl">
                            <AlertStripeAdvarsel>
                                <FormattedMessage id="step.fravaer.måVelgeSituasjon" />
                            </AlertStripeAdvarsel>
                        </FormBlock>
                    )}

                    {kanIkkeFortsette === false && (
                        <>
                            <FormBlock margin="xl">
                                <SøknadFormComponents.YesOrNoQuestion
                                    name={SøknadFormField.perioder_harVærtIUtlandet}
                                    legend={intlHelper(
                                        intl,
                                        'step.fravaer.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                                    )}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </FormBlock>
                            {perioder_harVærtIUtlandet === YesOrNo.YES && (
                                <FormBlock margin="l">
                                    <BostedUtlandListAndDialog<SøknadFormField>
                                        name={SøknadFormField.perioder_utenlandsopphold}
                                        minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                                        maxDate={GYLDIG_TIDSROM.to || dateToday}
                                        labels={{
                                            addLabel: intlHelper(intl, 'step.fravaer.utenlandsopphold.addLabel'),
                                            modalTitle: intlHelper(intl, 'step.fravaer.utenlandsopphold.modalTitle'),
                                        }}
                                        validate={validateRequiredList}
                                    />
                                </FormBlock>
                            )}
                            <FormBlock>
                                <SøknadFormComponents.YesOrNoQuestion
                                    name={SøknadFormField.harSøktAndreUtbetalinger}
                                    legend={intlHelper(intl, 'step.fravaer.harSøktAndreUtbetalinger.spm')}
                                    validate={validateYesOrNoIsAnswered}
                                />
                                {values.harSøktAndreUtbetalinger === YesOrNo.YES && (
                                    <FormBlock>
                                        <SøknadFormComponents.CheckboxPanelGroup
                                            name={SøknadFormField.andreUtbetalinger}
                                            legend={intlHelper(intl, 'step.fravaer.hvilke_utbetalinger.spm')}
                                            checkboxes={[
                                                {
                                                    id: AndreUtbetalinger.dagpenger,
                                                    value: AndreUtbetalinger.dagpenger,
                                                    label: intlHelper(intl, 'andreUtbetalinger.dagpenger'),
                                                },
                                                {
                                                    id: AndreUtbetalinger.sykepenger,
                                                    value: AndreUtbetalinger.sykepenger,
                                                    label: intlHelper(intl, 'andreUtbetalinger.sykepenger'),
                                                },
                                                {
                                                    id: AndreUtbetalinger.midlertidigkompensasjonsnfri,
                                                    value: AndreUtbetalinger.midlertidigkompensasjonsnfri,
                                                    label: intlHelper(
                                                        intl,
                                                        'andreUtbetalinger.midlertidigkompensasjonsnfri'
                                                    ),
                                                },
                                            ]}
                                            validate={validateRequiredList}
                                        />
                                    </FormBlock>
                                )}
                            </FormBlock>
                        </>
                    )}
                </>
            )}
        </SøknadStep>
    );
};

export default FraværStep;
