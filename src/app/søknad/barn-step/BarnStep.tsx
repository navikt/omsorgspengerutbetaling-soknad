import * as React from 'react';
import { useIntl } from 'react-intl';
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
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { Barn } from '../../types/Søkerdata';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { nYearsAgo } from '../../utils/aldersUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { validateAleneomsorgForBarn } from '../../validation/fieldValidations';

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

    return (
        <SøknadStep id={StepID.BARN} onValidFormSubmit={onValidSubmit} cleanupStep={cleanupStep}>
            <FormBlock>
                <CounsellorPanel>
                    <p>{intlHelper(intl, 'steg.barn.info.title')}</p>
                    <p>{intlHelper(intl, 'steg.barn.info')}</p>
                </CounsellorPanel>
            </FormBlock>

            {registrerteBarn.length > 0 && (
                <FormBlock>
                    <ContentWithHeader header={intlHelper(intl, 'step.barn.registrerteBarn.listHeader')}>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                            labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn)}
                            items={registrerteBarn}
                        />
                    </ContentWithHeader>
                </FormBlock>
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
                />
            </FormBlock>

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harAleneomsorg}
                    legend={
                        antallBarn === 1
                            ? intlHelper(intl, 'steg.barn.harAleneOmsorg.ettBarn.spm')
                            : intlHelper(intl, 'steg.barn.harAleneOmsorg.flereBarn.spm')
                    }
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {harAleneomsorg === YesOrNo.YES && (
                <FormBlock>
                    <SøknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'steg.barn.hvilkeAvBarnaAleneomsorg.spm')}
                        name={SøknadFormField.harAleneomsorgFor}
                        checkboxes={barnOptions}
                        validate={validateAleneomsorgForBarn}
                    />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default BarnStep;
