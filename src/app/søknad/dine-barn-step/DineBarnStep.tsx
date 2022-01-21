import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { useFormikContext } from 'formik';
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
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import dayjs from 'dayjs';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

interface OwnProps {
    barn: Barn[];
    søker: Person;
    onValidSubmit: () => void;
}

type Props = OwnProps;

const barnItemLabelRenderer = (barn: Barn, intl: IntlShape): React.ReactNode => {
    return (
        <div style={{ display: 'flex' }}>
            <span style={{ order: 2, paddingLeft: '1rem', justifySelf: 'flex-end' }}>
                {formatName(barn.fornavn, barn.etternavn, barn.mellomnavn)}
            </span>
            <span style={{ order: 1 }}>
                {intlHelper(intl, 'step.dine-barn.født')} {prettifyDate(barn.fødselsdato)}
            </span>
        </div>
    );
};

const getBarnOptions = (barn: Barn[] = [], andreBarn: AnnetBarn[] = []): CheckboksPanelProps[] => {
    return [
        ...barn.map((barnet) => ({
            label: `${formatName(barnet.fornavn, barnet.etternavn)} ${prettifyDate(barnet.fødselsdato)}`,
            value: barnet.aktørId,
        })),
        ...andreBarn.map((barnet) => ({
            label: `${barnet.navn} ${prettifyDate(barnet.fødselsdato)} `,
            value: barnet.fnr,
        })),
    ];
};

export const minstEtBarn12årIårellerYngre = (barn: Barn[], andreBarn: AnnetBarn[]): boolean | undefined => {
    if (barn.length > 0 || andreBarn.length > 0) {
        const barn12ellerYngre = barn.some((barn) => dayjs().year() - dayjs(barn.fødselsdato).year() <= 12);
        const andreBarn12ellerYngre = andreBarn.some((barn) => dayjs().year() - dayjs(barn.fødselsdato).year() <= 12);
        return barn12ellerYngre || andreBarn12ellerYngre;
    }
    return undefined;
};

export const cleanupDineBarnStep = (values: SøknadFormData, barn: Barn[], andreBarn: AnnetBarn[]): SøknadFormData => {
    if (minstEtBarn12årIårellerYngre(barn, andreBarn)) {
        return {
            ...values,
            harUtvidetRett: YesOrNo.UNANSWERED,
            harUtvidetRettFor: [],
        };
    }

    if (minstEtBarn12årIårellerYngre(barn, andreBarn) === false) {
        return {
            ...values,
            harDekketTiFørsteDagerSelv: undefined,
        };
    }
    return values;
};

const DineBarnStep: React.FC<Props> = ({ barn, søker, onValidSubmit }) => {
    const intl = useIntl();
    const {
        values: { andreBarn, harUtvidetRett },
    } = useFormikContext<SøknadFormData>();

    const barnOptions = getBarnOptions(barn, andreBarn);
    const kanIkkeFortsette = minstEtBarn12årIårellerYngre(barn, andreBarn) === false && harUtvidetRett === YesOrNo.NO;
    harUtvidetRett === YesOrNo.YES;
    const kanFortsette = ((barn !== undefined && barn.length > 0) || andreBarn.length > 0) && !kanIkkeFortsette;

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
            {barn.length > 0 && (
                <Box margin="xxxl">
                    <ContentWithHeader header={intlHelper(intl, 'step.dine-barn.listHeader.registrerteBarn')}>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                            labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn, intl)}
                            items={barn}
                        />
                    </ContentWithHeader>
                </Box>
            )}
            <Box margin="xl">
                <ContentWithHeader
                    header={
                        andreBarn.length === 0
                            ? intlHelper(intl, 'step.dine-barn.info.spm.andreBarn')
                            : intlHelper(intl, 'step.dine-barn.info.spm.flereBarn')
                    }>
                    {intlHelper(intl, 'step.dine-barn.info.spm.text')}
                </ContentWithHeader>
            </Box>
            <Box margin="l">
                <AnnetBarnListAndDialog<SøknadFormField>
                    name={SøknadFormField.andreBarn}
                    labels={{
                        addLabel: 'Legg til barn',
                        listTitle: 'Andre barn',
                        modalTitle: 'Legg til barn',
                    }}
                    maxDate={dateToday}
                    minDate={nYearsAgo(18)}
                    disallowedFødselsnumre={[søker.fødselsnummer]}
                    aldersGrenseText={intlHelper(intl, 'step.dine-barn.formLeggTilBarn.aldersGrenseInfo')}
                />
            </Box>
            {minstEtBarn12årIårellerYngre(barn, andreBarn) === false && (
                <FormBlock margin="xxxl">
                    <ContentWithHeader header={intlHelper(intl, 'step.dine-barn.harFåttEkstraOmsorgsdager.label')}>
                        <Box margin="xl">
                            <SøknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.harUtvidetRett}
                                legend={intlHelper(intl, 'step.dine-barn.harFåttEkstraOmsorgsdager.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </Box>
                        <Box margin="xl">
                            {harUtvidetRett === YesOrNo.YES && (
                                <>
                                    <SøknadFormComponents.CheckboxPanelGroup
                                        legend={intlHelper(intl, 'step.dine-barn.utvidetRettFor.spm')}
                                        name={SøknadFormField.harUtvidetRettFor}
                                        checkboxes={barnOptions}
                                        validate={getListValidator({ required: true })}
                                    />
                                    <Box margin="l">
                                        <AlertStripeInfo>
                                            <FormattedMessage id="step.dine-barn.utvidetRettFor.info" />
                                        </AlertStripeInfo>
                                    </Box>
                                </>
                            )}

                            {harUtvidetRett === YesOrNo.NO && (
                                <AlertStripeInfo>
                                    <FormattedMessage id="step.dine-barn.harFåttEkstraOmsorgsdager.nei.alertStripe" />
                                </AlertStripeInfo>
                            )}
                        </Box>
                    </ContentWithHeader>
                </FormBlock>
            )}
            {minstEtBarn12årIårellerYngre(barn, andreBarn) && (
                <Box>
                    <FormBlock margin="xl">
                        <AlertStripeInfo>
                            <FormattedMessage id="step.dine-barn.bekrefterDektTiDagerSelv.info" />
                        </AlertStripeInfo>
                    </FormBlock>
                    <FormBlock margin="xl">
                        <ContentWithHeader header={intlHelper(intl, 'step.dine-barn.bekrefterDektTiDagerSelv.label')}>
                            <SøknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.dine-barn.bekrefterDektTiDagerSelv')}
                                name={SøknadFormField.harDekketTiFørsteDagerSelv}
                                validate={getCheckedValidator()}
                            />
                        </ContentWithHeader>
                    </FormBlock>
                </Box>
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
