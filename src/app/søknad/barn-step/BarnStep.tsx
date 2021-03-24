import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormField } from '../../types/SøknadFormData';
import { nYearsAgo } from '../../utils/aldersUtils';
import SøknadStep from '../SøknadStep';

const BarnStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();

    return (
        <SøknadStep id={StepID.BARN} onValidFormSubmit={onValidSubmit}>
            <FormBlock>
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id="steg.barn.info" />
                    </p>
                </CounsellorPanel>
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
        </SøknadStep>
    );
};

export default BarnStep;
