import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { Barn } from '../../types/Søkerdata';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { nYearsAgo } from '../../utils/aldersUtils';
import { validateAleneomsorgForBarn, validateAndreBarn } from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormSection from '../../components/form-section/FormSection';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Note from '../../components/note/Note';

interface OwnProps {
    registrerteBarn: Barn[];
}

type Props = OwnProps & StepConfigProps;

const barnItemLabelRenderer = (barn: Barn): React.ReactNode => {
    return <div>{formatName(barn.fornavn, barn.etternavn, barn.mellomnavn)}</div>;
};

const getBarnOptions = (barn: Barn[] = [], andreBarn: AnnetBarn[] = []): CheckboksPanelProps[] => {
    return [
        ...barn.map((barnet) => ({
            label: `${formatName(barnet.fornavn, barnet.etternavn)}`,
            value: barnet.aktørId,
        })),
        ...andreBarn.map((barnet) => ({
            label: `${barnet.navn}`,
            value: barnet.fnr,
        })),
    ];
};

const cleanupStep = (values: SøknadFormData): SøknadFormData => {
    return {
        ...values,
        harAleneomsorgFor: values.harAleneomsorg === YesOrNo.YES ? values.harAleneomsorgFor : [],
    };
};

const BarnStep: React.FunctionComponent<Props> = ({ registrerteBarn, onValidSubmit }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();
    const { harAleneomsorg, harAleneomsorgFor, andreBarn } = values;

    const barnOptions = getBarnOptions(registrerteBarn, andreBarn);
    const antallBarn = barnOptions.length;

    const verifyHarAleneomsorgFor = React.useCallback(() => {
        const cleanedHarAleneomsorgFor = harAleneomsorgFor.filter((f) => {
            return barnOptions.findIndex((b) => b.value === f) >= 0;
        });
        if (cleanedHarAleneomsorgFor.length !== harAleneomsorgFor.length) {
            setFieldValue(SøknadFormField.harAleneomsorgFor, cleanedHarAleneomsorgFor);
        }
    }, [setFieldValue, harAleneomsorgFor, barnOptions]);

    React.useEffect(() => {
        verifyHarAleneomsorgFor();
    }, [andreBarn, verifyHarAleneomsorgFor]);

    const harBarn = andreBarn.length + registrerteBarn.length > 0;

    return (
        <SøknadStep id={StepID.BARN} onValidFormSubmit={onValidSubmit} cleanupStep={cleanupStep}>
            <FormBlock>
                <CounsellorPanel>
                    <Note>
                        Her ser du barn som er registrert på deg. Det er kun barn under 18 år som vises her. Hvis du har
                        barn som har fylt 18 år i år, og som du har fått ekstra omsorgsdager for, kan du selv legge til
                        dette barnet.
                    </Note>
                </CounsellorPanel>
            </FormBlock>

            <FormSection title="Dine barn">
                {registrerteBarn.length === 0 ? (
                    <AlertStripe type="info">
                        <FormattedMessage id="steg.barn.info.ingenBarnFunnet" />
                    </AlertStripe>
                ) : (
                    <ContentWithHeader header={intlHelper(intl, 'step.barn.registrerteBarn.listHeader')}>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                            labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn)}
                            items={registrerteBarn}
                        />
                    </ContentWithHeader>
                )}
                <FormBlock>
                    <ContentWithHeader
                        header={
                            registrerteBarn.length === 0
                                ? intlHelper(intl, 'steg.barn.info.title.andreBarn')
                                : intlHelper(intl, 'steg.barn.info.title.flereBarn')
                        }>
                        {intlHelper(intl, 'steg.barn.info.text')}
                    </ContentWithHeader>
                </FormBlock>
                <FormBlock>
                    <AnnetBarnListAndDialog<SøknadFormField>
                        name={SøknadFormField.andreBarn}
                        includeFødselsdatoSpørsmål={false}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.barn.annetBarn.addLabel'),
                            listTitle: intlHelper(intl, 'steg.barn.annetBarn.listTitle'),
                            modalTitle: intlHelper(intl, 'steg.barn.annetBarn.modalTitle'),
                        }}
                        maxDate={dateToday}
                        minDate={nYearsAgo(18)}
                        aldersGrenseText={intlHelper(intl, 'steg.barn.aldersGrenseInfo')}
                        validate={harBarn ? undefined : validateAndreBarn}
                    />
                </FormBlock>
            </FormSection>

            <FormSection title="Aleneomsorg">
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harAleneomsorg}
                    description={
                        <ExpandableInfo title="Hva betyr dette?">
                            <Note>Informasjon må skrives</Note>
                        </ExpandableInfo>
                    }
                    legend={
                        antallBarn === 1
                            ? intlHelper(intl, 'steg.barn.harAleneOmsorg.ettBarn.spm')
                            : intlHelper(intl, 'steg.barn.harAleneOmsorg.flereBarn.spm')
                    }
                    validate={validateYesOrNoIsAnswered}
                />
                {harAleneomsorg === YesOrNo.YES && (
                    <>
                        <FormBlock>
                            <SøknadFormComponents.CheckboxPanelGroup
                                legend={intlHelper(intl, 'steg.barn.hvilkeAvBarnaAleneomsorg.spm')}
                                name={SøknadFormField.harAleneomsorgFor}
                                checkboxes={barnOptions}
                                validate={validateAleneomsorgForBarn}
                            />
                        </FormBlock>
                        <Box margin="l">
                            <AlertStripe type="info">
                                infoboks om at denne informasjonen lagres (presisere lagringen? Hvor lenge?) for
                                fremtidige behandlinger og det må gis beskjed hvis man ikke lenger er alene om omsorgen{' '}
                            </AlertStripe>
                        </Box>
                    </>
                )}
            </FormSection>
        </SøknadStep>
    );
};

export default BarnStep;
