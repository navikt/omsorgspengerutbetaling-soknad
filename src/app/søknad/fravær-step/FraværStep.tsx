import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import {
    FraværDag,
    fraværDagToFraværDateRange,
    FraværPeriode,
    fraværPeriodeToDateRange,
} from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { validateAll, validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import dayjs from 'dayjs';
import MinMax from 'dayjs/plugin/minMax';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import FormSection from '../../components/form-section/FormSection';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import getLenker from '../../lenker';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getPeriodeBoundaries } from '../../utils/periodeUtils';
import { validateFraværDagHarÅrstall, validateFraværPeriodeHarÅrstall } from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import './fraværStep.less';

dayjs.extend(MinMax);

const getÅrstallFromFravær = (
    dagerMedDelvisFravær: FraværDag[],
    perioderMedFravær: FraværPeriode[]
): number | undefined => {
    const førsteDag = dagerMedDelvisFravær.length > 0 ? dagerMedDelvisFravær[0].dato : undefined;
    const førsteDagIPeriode = perioderMedFravær.length > 0 ? perioderMedFravær[0].fraOgMed : undefined;
    const dager: Date[] = [...(førsteDag ? [førsteDag] : []), ...(førsteDagIPeriode ? [førsteDagIPeriode] : [])];
    switch (dager.length) {
        case 0:
            return undefined;
        case 1:
            return dayjs(dager[0]).get('year');
        default:
            return dayjs.min(dager.map((d) => dayjs(d))).get('year');
    }
};
const getTidsromFromÅrstall = (årstall?: number): DateRange => {
    if (årstall === undefined) {
        return { from: date1YearAgo, to: dayjs().endOf('day').toDate() };
    }
    const førsteDagIÅret = dayjs(`${årstall}-01-01`).toDate();
    const sisteDagIÅret = dayjs(`${årstall}-12-31`).toDate();
    return {
        from: førsteDagIÅret,
        to: dayjs.min([dayjs(sisteDagIÅret), dayjs(dateToday)]).toDate(),
    };
};

const FraværStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();
    const {
        harPerioderMedFravær,
        harDagerMedDelvisFravær,
        perioder_harVærtIUtlandet,
        fraværDager,
        fraværPerioder,
        harDekketTiFørsteDagerSelv,
    } = values;

    const intl = useIntl();
    const [årstall, setÅrstall] = useState<number | undefined>();
    const [gyldigTidsrom, setGyldigTidsrom] = useState<DateRange>(
        getTidsromFromÅrstall(getÅrstallFromFravær(fraværDager, fraværPerioder))
    );
    const førsteOgSisteDagMedFravær = getPeriodeBoundaries(fraværPerioder, fraværDager);

    const updateÅrstall = useCallback(
        (årstall: number | undefined) => {
            setÅrstall(årstall);
            setGyldigTidsrom(getTidsromFromÅrstall(årstall));
        },
        [setÅrstall]
    );

    useEffect(() => {
        const nyttÅrstall = getÅrstallFromFravær(fraværDager, fraværPerioder);
        if (nyttÅrstall !== årstall) {
            updateÅrstall(nyttÅrstall);
        }
    }, [årstall, fraværDager, fraværPerioder, updateÅrstall]);

    const tidsromBegrensningInfo =
        årstall !== undefined && 1 + 1 === 3 ? (
            <ExpandableInfo title="Om begrensninger i hvilke datoer du kan velge ... (eller noe sånt)">
                <p style={{ marginTop: 0 }}>
                    En søknad kan kun inneholde fraværsdager i ett og samme år. Du har allerede lagt til fraværsdager i{' '}
                    {årstall}, og du kan da bare velge datoer i dette året.
                </p>
                <FormattedMessage id="step.fravaer.info.ikkeHelg.tekst" />
            </ExpandableInfo>
        ) : (
            <ExpandableInfo title={intlHelper(intl, 'step.fravaer.info.ikkeHelg.tittel')}>
                <FormattedMessage id="step.fravaer.info.ikkeHelg.tekst" />
            </ExpandableInfo>
        );

    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;
    const harRegistrertFravær = fraværDager.length + fraværPerioder.length > 0;
    const minDateForFravær = harRegistrertFravær ? gyldigTidsrom.from : date1YearAgo;
    const maxDateForFravær = harRegistrertFravær ? gyldigTidsrom.to : dateToday;
    const inneværendeÅr = new Date().getFullYear();
    const forrigeÅr = inneværendeÅr - 1;

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
            id={StepID.FRAVÆR}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={kanIkkeFortsette === false}>
            <FormBlock>
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <p>
                        <FormattedMessage id="step.fravaer.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="step.fravaer.info.2" />
                    </p>
                </CounsellorPanel>
            </FormBlock>

            <FormSection title={intlHelper(intl, 'step.fravaer.dekkeSelv.tittel')}>
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.harDekketTiFørsteDagerSelv}
                        legend={intlHelper(intl, 'step.fravaer.spm.harDekketTiFørsteDagerSelv')}
                        description={
                            <ExpandableInfo title={intlHelper(intl, 'step.fravaer.dekkeSelv.info.tittel')}>
                                <p style={{ marginTop: '0' }}>
                                    <FormattedMessage id="step.fravaer.dekkeSelv.info.1" />
                                </p>
                                <p>
                                    <FormattedMessage id="step.fravaer.dekkeSelv.info.2" />{' '}
                                    <Lenke href={getLenker(intl.locale).søkeEkstraDager}>
                                        <FormattedMessage id="step.fravaer.dekkeSelv.info.3" />
                                    </Lenke>
                                </p>
                            </ExpandableInfo>
                        }
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
                {harDekketTiFørsteDagerSelv === YesOrNo.NO && (
                    <FormBlock>
                        <AlertStripeInfo>
                            <p style={{ marginTop: '0' }}>
                                <FormattedMessage id="step.fravaer.ikkeDekket.info.1" />
                            </p>
                            <p>
                                <FormattedMessage id="step.fravaer.ikkeDekket.info.2" />
                            </p>
                        </AlertStripeInfo>
                    </FormBlock>
                )}
            </FormSection>

            <FormSection title={intlHelper(intl, 'step.fravaer.dager.tittel')}>
                <p>
                    <FormattedMessage id="step.fravaer.dager.info" values={{ forrigeÅr, inneværendeÅr }} />
                </p>

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
                                periodeDescription={tidsromBegrensningInfo}
                                minDate={minDateForFravær}
                                maxDate={maxDateForFravær}
                                validate={validateAll([
                                    validateRequiredList,
                                    validateFraværPeriodeHarÅrstall(values.fraværPerioder, årstall),
                                    validateNoCollisions(values.fraværDager, values.fraværPerioder),
                                ])}
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
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.harDagerMedDelvisFravær}
                        legend={intlHelper(intl, 'step.fravaer.spm.harDagerMedDelvisFravær')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
                {/* DAGER MED DELVIS FRAVÆR*/}
                {harDagerMedDelvisFravær === YesOrNo.YES && (
                    <>
                        <FormBlock margin="xl">
                            <FraværDagerListAndDialog<SøknadFormField>
                                name={SøknadFormField.fraværDager}
                                dagDescription={tidsromBegrensningInfo}
                                minDate={minDateForFravær}
                                maxDate={maxDateForFravær}
                                validate={validateAll([
                                    validateRequiredList,
                                    validateFraværDagHarÅrstall(values.fraværDager, årstall),
                                    validateNoCollisions(
                                        values[SøknadFormField.fraværDager],
                                        values[SøknadFormField.fraværPerioder]
                                    ),
                                ])}
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

            {kanIkkeFortsette === false && (
                <>
                    <FormSection title={intlHelper(intl, 'step.fravaer.utenlandsopphold.tittel')}>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.perioder_harVærtIUtlandet}
                            legend={intlHelper(
                                intl,
                                'step.fravaer.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                            )}
                            validate={validateYesOrNoIsAnswered}
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
                                    validate={validateRequiredList}
                                />
                            </FormBlock>
                        )}
                    </FormSection>
                    <FormSection title={intlHelper(intl, 'step.fravaer.andreUtbetalinger')}>
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
                                            label: intlHelper(intl, 'andreUtbetalinger.midlertidigkompensasjonsnfri'),
                                        },
                                    ]}
                                    validate={validateRequiredList}
                                />
                            </FormBlock>
                        )}
                    </FormSection>
                </>
            )}
        </SøknadStep>
    );
};

export default FraværStep;
