import * as React from 'react';
import { useIntl } from 'react-intl';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { FieldArray, useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { FraværDelerAvDag, Periode } from '../../../@types/omsorgspengerutbetaling-schema';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import DagerMedDelvisFraværList from './components/DagerMedDelvisFraværList';
import PeriodeMedFulltFraværList from './components/PerioderMedFulltFraværList';
import './periodeStep.less';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values, validateField, validateForm } = useFormikContext<SøknadFormData>();
    const {
        perioderMedFravær,
        dagerMedDelvisFravær,
        harPerioderMedFravær,
        harDagerMedDelvisFravær,
        perioder_harVærtIUtlandet
    } = values;

    const intl = useIntl();
    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;

    const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
        const cleanedValues = { ...valuesToBeCleaned };
        if (harDagerMedDelvisFravær === YesOrNo.NO) {
            cleanedValues.dagerMedDelvisFravær = [];
        }
        if (harPerioderMedFravær === YesOrNo.NO) {
            cleanedValues.perioderMedFravær = [];
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
                        Her legger du inn dager du har hatt fravær fra jobb fordi du har vært hjemme med omsorgsdager.
                        NAV utbetaler som hovedregel fra den 4. dagen i du har vært hjemme i år.
                    </p>
                    <p>
                        Du kan søke om utbetaling tilbake i tid, og fram til dagens dato. NAV kan utbetale omsorgspenger
                        for opp til 3 måneder tilbake i tid.
                    </p>
                    <p>
                        I påsken ville barnehagen/skolen uansett vært stengt på røde dager. For de røde dagene kan du
                        kun få omsorgspenger hvis du ikke kunne vært på jobb fordi barnet eller barnepasser var syk.
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
                <FormBlock margin={perioderMedFravær.length > 0 ? 'l' : 'none'}>
                    <FieldArray
                        name={SøknadFormField.perioderMedFravær}
                        render={(arrayHelpers) => {
                            return (
                                <PeriodeMedFulltFraværList
                                    perioderMedFravær={perioderMedFravær}
                                    dagerMedGradvisFravær={
                                        harDagerMedDelvisFravær === YesOrNo.YES ? dagerMedDelvisFravær : []
                                    }
                                    onCreateNew={() => {
                                        const emptyPeriodeMedFravær: Partial<Periode> = {
                                            fom: undefined,
                                            tom: undefined
                                        };

                                        arrayHelpers.insert(perioderMedFravær.length, emptyPeriodeMedFravær);
                                        setTimeout(() => {
                                            validateField(SøknadFormField.perioderMedFraværGroup);
                                        });
                                    }}
                                    onRemove={(idx) => {
                                        arrayHelpers.remove(idx);
                                        setTimeout(() => {
                                            validateForm();
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </FormBlock>
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
                <FormBlock margin={dagerMedDelvisFravær.length > 0 ? 'l' : 'none'}>
                    <FieldArray
                        name={SøknadFormField.dagerMedDelvisFravær}
                        render={(arrayHelpers) => {
                            return (
                                <DagerMedDelvisFraværList
                                    dagerMedDelvisFravær={dagerMedDelvisFravær}
                                    perioderMedFravær={harPerioderMedFravær === YesOrNo.YES ? perioderMedFravær : []}
                                    onCreateNew={() => {
                                        const emptyDagMedFravær: Partial<FraværDelerAvDag> = {
                                            dato: undefined,
                                            timer: undefined
                                        };
                                        arrayHelpers.insert(dagerMedDelvisFravær.length, emptyDagMedFravær);
                                    }}
                                    onRemove={(idx) => {
                                        arrayHelpers.remove(idx);
                                        setTimeout(() => {
                                            validateForm();
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </FormBlock>
            )}

            {kanIkkeFortsette && (
                <FormBlock margin="xxl">
                    <AlertStripeAdvarsel>Du må velge én av situasjonene over. </AlertStripeAdvarsel>
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
