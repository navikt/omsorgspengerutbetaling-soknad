import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { fraværDagToFraværDateRange, validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { validateAll } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import SmittevernInfo from '../../components/information/SmittevernInfo';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { GYLDIG_TIDSROM } from '../../validation/constants';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import './periodeStep.less';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
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
                        <FormattedMessage id="step.periode.info.1" />
                    </p>

                    <p>
                        <FormattedMessage id="step.periode.info.2" />
                    </p>
                    <ul>
                        <li>
                            <FormattedMessage id="step.periode.info.2.1" />
                        </li>
                        <li>
                            <FormattedMessage id="step.periode.info.2.2" />
                        </li>
                        <li>
                            <FormattedMessage id="step.periode.info.2.3" />
                        </li>
                    </ul>
                    <p>
                        <FormattedMessage id="step.periode.info.3" />
                    </p>
                    <p>
                        <FormattedMessage id="step.periode.info.4" />
                    </p>
                </CounsellorPanel>
            </FormBlock>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harPerioderMedFravær}
                    legend={intlHelper(intl, 'step.periode.spm.harPerioderMedFravær')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED FULLT FRAVÆR*/}
            {harPerioderMedFravær === YesOrNo.YES && (
                <>
                    <FormBlock margin="l">
                        <FraværPerioderListAndDialog<SøknadFormField>
                            name={SøknadFormField.fraværPerioder}
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
                                addLabel: intlHelper(intl, 'step.periode.harPerioderMedFravær.addLabel'),
                                modalTitle: intlHelper(intl, 'step.periode.harPerioderMedFravær.modalTitle'),
                            }}
                            dateRangesToDisable={[
                                ...values.fraværPerioder,
                                ...values.fraværDager.map(fraværDagToFraværDateRange),
                            ]}
                            helgedagerIkkeTillat={true}
                        />
                        <FormBlock margin="l">
                            <ExpandableInfo
                                title={intlHelper(intl, 'step.periode.harPerioderMedFravær.info.ikkeHelg.tittel')}>
                                <FormattedMessage id="step.periode.harPerioderMedFravær.info.ikkeHelg.tekst" />
                            </ExpandableInfo>
                        </FormBlock>
                    </FormBlock>
                </>
            )}
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harDagerMedDelvisFravær}
                    legend={intlHelper(intl, 'step.periode.spm.harDagerMedDelvisFravær')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED DELVIS FRAVÆR*/}
            {harDagerMedDelvisFravær === YesOrNo.YES && (
                <>
                    <FormBlock margin="l">
                        <FraværDagerListAndDialog<SøknadFormField>
                            name={SøknadFormField.fraværDager}
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
                                addLabel: intlHelper(intl, 'step.periode.harDagerMedDelvisFravær.addLabel'),
                                modalTitle: intlHelper(intl, 'step.periode.harDagerMedDelvisFravær.modalTitle'),
                            }}
                            dateRangesToDisable={[
                                ...values.fraværDager.map(fraværDagToFraværDateRange),
                                ...values.fraværPerioder,
                            ]}
                            helgedagerIkkeTillatt={true}
                            maksArbeidstidPerDag={24}
                        />
                        <Box margin="l">
                            <ExpandableInfo
                                title={intlHelper(intl, 'step.periode.harDagerMedDelvisFravær.info.ikkeHelg.tittel')}>
                                <FormattedMessage id="step.periode.harDagerMedDelvisFravær.info.ikkeHelg.tekst" />
                            </ExpandableInfo>
                        </Box>
                    </FormBlock>
                </>
            )}

            {kanIkkeFortsette && (
                <FormBlock margin="xxl">
                    <AlertStripeAdvarsel>
                        <FormattedMessage id="step.periode.måVelgeSituasjon" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}

            {kanIkkeFortsette === false && (
                <>
                    {isFeatureEnabled(Feature.STENGT_BHG_SKOLE) && (
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.hjemmePgaStengtBhgSkole}
                                legend={intlHelper(intl, 'step.periode.spm.hjemmePgaStengtBhgSkole')}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                    )}
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.hjemmePgaSmittevernhensyn}
                            legend={intlHelper(intl, 'steg.intro.form.spm.smittevernhensyn')}
                            validate={validateYesOrNoIsAnswered}
                            description={
                                <ExpandableInfo title={intlHelper(intl, 'info.smittevern.tittel')}>
                                    <SmittevernInfo />
                                </ExpandableInfo>
                            }
                        />
                    </FormBlock>
                </>
            )}

            {kanIkkeFortsette === false && (
                <>
                    <FormBlock margin="xl">
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
                                    addLabel: intlHelper(intl, 'step.periode.utenlandsopphold.addLabel'),
                                    modalTitle: intlHelper(intl, 'step.periode.utenlandsopphold.modalTitle'),
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
                                            label: intlHelper(intl, 'andre_utbetalinger.dagpenger'),
                                        },
                                        {
                                            id: AndreUtbetalinger.sykepenger,
                                            value: AndreUtbetalinger.sykepenger,
                                            label: intlHelper(intl, 'andre_utbetalinger.sykepenger'),
                                        },
                                        {
                                            id: AndreUtbetalinger.midlertidigkompensasjonsnfri,
                                            value: AndreUtbetalinger.midlertidigkompensasjonsnfri,
                                            label: intlHelper(intl, 'andre_utbetalinger.midlertidigkompensasjonsnfri'),
                                        },
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
