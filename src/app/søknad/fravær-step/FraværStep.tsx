import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, DateRange, dateToday } from '@navikt/sif-common-utils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { fraværDagToFraværDateRange, fraværPeriodeToDateRange } from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getPeriodeBoundaries } from '../../utils/periodeUtils';
import SoknadFormComponents from '../SoknadFormComponents';
import FraværStepInfo from './FraværStepInfo';
import fraværStepUtils from './fraværStepUtils';
import { getFraværDagerValidator, getFraværPerioderValidator } from './fraværFieldValidations';
import { StepID } from '../soknadStepsConfig';
import SoknadFormStep from '../SoknadFormStep';

const FraværStep: React.FC = () => {
    const { values } = useFormikContext<SøknadFormData>();
    const {
        harPerioderMedFravær,
        harDagerMedDelvisFravær,
        perioder_harVærtIUtlandet,
        fraværDager,
        fraværPerioder,
        harUtvidetRettFor,
    } = values;

    const intl = useIntl();
    const [årstall, setÅrstall] = useState<number | undefined>();
    const [gyldigTidsrom, setGyldigTidsrom] = useState<DateRange>(
        fraværStepUtils.getTidsromFromÅrstall(fraværStepUtils.getÅrstallFromFravær(fraværDager, fraværPerioder))
    );
    const førsteOgSisteDagMedFravær = getPeriodeBoundaries(fraværPerioder, fraværDager);

    const updateÅrstall = useCallback(
        (årstall: number | undefined) => {
            setÅrstall(årstall);
            setGyldigTidsrom(fraværStepUtils.getTidsromFromÅrstall(årstall));
        },
        [setÅrstall]
    );

    useEffect(() => {
        const nyttÅrstall = fraværStepUtils.getÅrstallFromFravær(fraværDager, fraværPerioder);
        if (nyttÅrstall !== årstall) {
            updateÅrstall(nyttÅrstall);
        }
    }, [årstall, fraværDager, fraværPerioder, updateÅrstall]);

    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;
    const harRegistrertFravær = fraværDager.length + fraværPerioder.length > 0;
    const søkerHarBarnMedUtvidetRett = harUtvidetRettFor.length > 0;
    const minDateForFravær = harRegistrertFravær ? gyldigTidsrom.from : date1YearAgo;
    const maxDateForFravær = harRegistrertFravær ? gyldigTidsrom.to : dateToday;

    return (
        <SoknadFormStep
            id={StepID.FRAVÆR}
            onStepCleanup={fraværStepUtils.cleanupFraværStep}
            showSubmitButton={kanIkkeFortsette === false}>
            <FormBlock>
                <FraværStepInfo.IntroVeileder />
            </FormBlock>
            <FormBlock>
                <FormSection title={intlHelper(intl, 'step.fravaer.dager.tittel')}>
                    <p>
                        {søkerHarBarnMedUtvidetRett ? (
                            <FormattedMessage id="step.fravaer.dager.info.harBarnMedUtvidetRett" />
                        ) : (
                            <FormattedMessage id="step.fravaer.dager.info" />
                        )}
                    </p>
                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.harPerioderMedFravær}
                            legend={intlHelper(intl, 'step.fravaer.spm.harPerioderMedFravær')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>
                    {/* DAGER MED FULLT FRAVÆR*/}
                    {harPerioderMedFravær === YesOrNo.YES && (
                        <>
                            <FormBlock margin="l">
                                <FraværPerioderListAndDialog<SøknadFormField>
                                    name={SøknadFormField.fraværPerioder}
                                    periodeDescription={<FraværStepInfo.Tidsbegrensning />}
                                    minDate={minDateForFravær}
                                    maxDate={maxDateForFravær}
                                    validate={getFraværPerioderValidator({ fraværDager, årstall })}
                                    labels={{
                                        listTitle: intlHelper(intl, 'step.fravaer.harPerioderMedFravær.listTitle'),
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
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.harDagerMedDelvisFravær}
                            legend={intlHelper(intl, 'step.fravaer.spm.harDagerMedDelvisFravær')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>
                    {/* DAGER MED DELVIS FRAVÆR*/}
                    {harDagerMedDelvisFravær === YesOrNo.YES && (
                        <>
                            <FormBlock margin="l">
                                <FraværDagerListAndDialog<SøknadFormField>
                                    name={SøknadFormField.fraværDager}
                                    dagDescription={<FraværStepInfo.Tidsbegrensning />}
                                    minDate={minDateForFravær}
                                    maxDate={maxDateForFravær}
                                    validate={getFraværDagerValidator({ fraværPerioder, årstall })}
                                    labels={{
                                        listTitle: intlHelper(intl, 'step.fravaer.harDagerMedDelvisFravær.listTitle'),
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
                </FormSection>
            </FormBlock>
            {kanIkkeFortsette === false && (
                <>
                    <FormSection title={intlHelper(intl, 'step.fravaer.utenlandsopphold.tittel')}>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.perioder_harVærtIUtlandet}
                            legend={intlHelper(
                                intl,
                                'step.fravaer.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                            )}
                            validate={getYesOrNoValidator()}
                        />
                        {perioder_harVærtIUtlandet === YesOrNo.YES && (
                            <FormBlock margin="l">
                                <BostedUtlandListAndDialog<SøknadFormField>
                                    name={SøknadFormField.perioder_utenlandsopphold}
                                    minDate={førsteOgSisteDagMedFravær.min || gyldigTidsrom.from}
                                    maxDate={førsteOgSisteDagMedFravær.max || gyldigTidsrom.to}
                                    labels={{
                                        addLabel: intlHelper(intl, 'step.fravaer.utenlandsopphold.addLabel'),
                                        modalTitle: intlHelper(intl, 'step.fravaer.utenlandsopphold.modalTitle'),
                                    }}
                                    validate={getListValidator({ required: true })}
                                />
                            </FormBlock>
                        )}
                    </FormSection>
                </>
            )}
        </SoknadFormStep>
    );
};

export default FraværStep;
