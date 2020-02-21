import * as React from 'react';
import { useIntl } from 'react-intl';
import FormikCheckboxPanelGroup from 'common/formik/formik-checkbox-panel-group/FormikCheckboxPanelGroup';
import { HistoryProps } from 'common/types/History';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, Arbeidssituasjon } from '../../../types/OmsorgspengesøknadFormData';
import { navigateTo } from '../../../utils/navigationUtils';
import { validateArbeid } from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const ArbeidStep: React.FunctionComponent<Props> = ({ history, nextStepRoute, ...stepProps }) => {
    const intl = useIntl();
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    return (
        <FormikStep id={StepID.ARBEID} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <FormikCheckboxPanelGroup<AppFormField>
                legend={intlHelper(intl, 'steg.arbeid.spm')}
                name={AppFormField.arbeidssituasjon}
                singleColumn={true}
                checkboxes={[
                    {
                        label: intlHelper(intl, 'arbeidssituasjon.arbeidstaker'),
                        value: Arbeidssituasjon.arbeidstaker,
                        key: Arbeidssituasjon.arbeidstaker
                    },
                    {
                        label: intlHelper(intl, 'arbeidssituasjon.selvstendigNæringsdrivende'),
                        value: Arbeidssituasjon.selvstendigNæringsdrivende,
                        key: Arbeidssituasjon.selvstendigNæringsdrivende
                    },
                    {
                        label: intlHelper(intl, 'arbeidssituasjon.frilanser'),
                        value: Arbeidssituasjon.frilanser,
                        key: Arbeidssituasjon.frilanser
                    }
                ]}
                validate={validateArbeid}
            />
        </FormikStep>
    );
};

// Todo - kommer ikke videre ved første valg

export default ArbeidStep;
