import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import AlertStripe from 'nav-frontend-alertstriper';
import { nYearsAgo } from '../../utils/aldersUtils';
import { StepID } from '../../config/stepConfig';
import { Barn, Person } from '../../types/Søkerdata';
import SøknadStep from '../SøknadStep';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import { getCheckedValidator, getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { cleanupDineBarnStep, getBarnOptions, minstEtBarn12årIårellerYngre } from './dineBarnStepUtils';
import SøknadTempStorage from '../SøknadTempStorage';
import FormSection from '../../components/form-section/FormSection';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import './dineBarn.less';
interface OwnProps {
    barn: Barn[];
    søker: Person;
    formValues: SøknadFormData;
    onValidSubmit: () => void;
}

type Props = OwnProps;

const bem = bemUtils('dineBarn');

const barnItemLabelRenderer = (barn: Barn, intl: IntlShape): React.ReactNode => {
    return (
        <div className={bem.element('label')}>
            <div>{intlHelper(intl, 'step.dine-barn.født')}</div>
            <div className={bem.element('fodselsdato')}>{prettifyDate(barn.fødselsdato)}</div>
            <div className={bem.element('navn')}>{formatName(barn.fornavn, barn.etternavn, barn.mellomnavn)}</div>
        </div>
    );
};

const DineBarnStep: React.FC<Props> = ({ barn, søker, formValues: values, onValidSubmit }) => {
    const intl = useIntl();
    const [andreBarnChanged, setAndreBarnChanged] = useState(false);
    const { andreBarn, harUtvidetRett, harUtvidetRettFor } = values;
    const barnOptions = getBarnOptions(barn, andreBarn);
    const andreBarnFnr = andreBarn.map((barn) => barn.fnr);
    const kanIkkeFortsette = minstEtBarn12årIårellerYngre(barn, andreBarn) === false && harUtvidetRett === YesOrNo.NO;
    const kanFortsette = ((barn !== undefined && barn.length > 0) || andreBarn.length > 0) && !kanIkkeFortsette;

    useEffect(() => {
        if (andreBarnChanged === true) {
            setAndreBarnChanged(false);
            SøknadTempStorage.update(values, StepID.DINE_BARN);
        }
    }, [andreBarnChanged, values]);

    return (
        <SøknadStep
            id={StepID.DINE_BARN}
            showSubmitButton={kanFortsette}
            onValidFormSubmit={onValidSubmit}
            cleanupStep={(values): SøknadFormData => cleanupDineBarnStep(values, barn, andreBarn)}>
            <CounsellorPanel>
                <FormattedMessage id="step.dine-barn.counsellorPanel.avsnitt.1" />
                <Box margin="l">
                    <FormattedMessage id="step.dine-barn.counsellorPanel.avsnitt.2" />
                </Box>
            </CounsellorPanel>
            <FormSection title={intlHelper(intl, 'step.dine-barn.seksjonsTittel')}>
                {barn.length > 0 && (
                    <Box>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                            labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn, intl)}
                            items={barn}
                        />
                    </Box>
                )}
                <FormBlock>
                    <ContentWithHeader
                        header={
                            andreBarn.length === 0
                                ? intlHelper(intl, 'step.dine-barn.info.spm.andreBarn')
                                : intlHelper(intl, 'step.dine-barn.info.spm.flereBarn')
                        }>
                        {intlHelper(intl, 'step.dine-barn.info.spm.text')}
                    </ContentWithHeader>
                </FormBlock>
                <Box margin="l">
                    <AnnetBarnListAndDialog<SøknadFormField>
                        name={SøknadFormField.andreBarn}
                        labels={{
                            addLabel: intlHelper(intl, 'step.dine-barn.annetBarnListAndDialog.addLabel'),
                            listTitle: intlHelper(intl, 'step.dine-barn.annetBarnListAndDialog.listTitle'),
                            modalTitle: intlHelper(intl, 'step.dine-barn.annetBarnListAndDialog.modalTitle'),
                        }}
                        maxDate={dateToday}
                        minDate={nYearsAgo(18)}
                        disallowedFødselsnumre={[...[søker.fødselsnummer], ...andreBarnFnr]}
                        aldersGrenseText={intlHelper(intl, 'step.dine-barn.formLeggTilBarn.aldersGrenseInfo')}
                        visBarnTypeValg={true}
                        onAfterChange={() => setAndreBarnChanged(true)}
                    />
                </Box>
            </FormSection>
            {minstEtBarn12årIårellerYngre(barn, andreBarn) === false && (
                <FormSection title={intlHelper(intl, 'step.dine-barn.harFåttEkstraOmsorgsdager.label')}>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.harUtvidetRett}
                        legend={
                            barn.length + andreBarn.length === 1
                                ? intlHelper(intl, 'step.dine-barn.harFåttEkstraOmsorgsdager.spm.ettBarn')
                                : intlHelper(intl, 'step.dine-barn.harFåttEkstraOmsorgsdager.spm')
                        }
                        validate={getYesOrNoValidator()}
                    />

                    <FormBlock>
                        {harUtvidetRett === YesOrNo.YES && (
                            <>
                                {barn.length + andreBarn.length > 1 && (
                                    <>
                                        <SøknadFormComponents.CheckboxPanelGroup
                                            legend={intlHelper(intl, 'step.dine-barn.utvidetRettFor.spm')}
                                            name={SøknadFormField.harUtvidetRettFor}
                                            checkboxes={barnOptions}
                                            validate={getListValidator({ required: true })}
                                        />
                                        {harUtvidetRettFor.length > 0 && (
                                            <Box margin="l">
                                                <AlertStripeInfo>
                                                    <FormattedMessage id="step.dine-barn.utvidetRettFor.info" />
                                                </AlertStripeInfo>
                                            </Box>
                                        )}
                                    </>
                                )}
                                {barn.length + andreBarn.length === 1 && (
                                    <Box margin="l">
                                        <AlertStripeInfo>
                                            <FormattedMessage id="step.dine-barn.utvidetRettFor.info.ettBarn" />
                                        </AlertStripeInfo>
                                    </Box>
                                )}
                            </>
                        )}

                        {harUtvidetRett === YesOrNo.NO && (
                            <AlertStripeInfo>
                                <FormattedMessage id="step.dine-barn.harFåttEkstraOmsorgsdager.nei.alertStripe" />
                            </AlertStripeInfo>
                        )}
                    </FormBlock>
                </FormSection>
            )}
            {minstEtBarn12årIårellerYngre(barn, andreBarn) && (
                <FormSection title={intlHelper(intl, 'step.dine-barn.bekrefterDektTiDagerSelv.info.titel')}>
                    <FormattedMessage id="step.dine-barn.bekrefterDektTiDagerSelv.info" />
                    <FormBlock>
                        <ContentWithHeader header={intlHelper(intl, 'step.dine-barn.bekrefterDektTiDagerSelv.label')}>
                            <SøknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.dine-barn.bekrefterDektTiDagerSelv')}
                                name={SøknadFormField.harDekketTiFørsteDagerSelv}
                                validate={getCheckedValidator()}
                            />
                        </ContentWithHeader>
                    </FormBlock>
                </FormSection>
            )}

            {andreBarn.length === 0 && barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'advarsel'}>{intlHelper(intl, 'step.dine-barn.info.ingenbarn.2')}</AlertStripe>
                </Box>
            )}
        </SøknadStep>
    );
};

export default DineBarnStep;
