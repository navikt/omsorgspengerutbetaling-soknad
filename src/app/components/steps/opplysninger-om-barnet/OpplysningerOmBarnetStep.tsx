import * as React from 'react';
import Box from 'common/components/box/Box';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { HistoryProps } from 'common/types/History';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { CustomFormikProps } from '../../../types/FormikProps';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { Søkerdata } from '../../../types/Søkerdata';
import { navigateTo } from '../../../utils/navigationUtils';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';

interface OpplysningerOmBarnetStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({ formikProps, nextStepRoute, history }: Props) => {
    const { handleSubmit, values } = formikProps;
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { søknadenGjelderEtAnnetBarn } = values;
    const hasChosenRegisteredChild = values[AppFormField.barnetSøknadenGjelder].length > 0;
    return (
        <FormikStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={navigate}
            handleSubmit={handleSubmit}
            history={history}
            formValues={values}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) => (
                    <>
                        {harRegistrerteBarn(søkerdata) && (
                            <RegistrertBarnPart søkersBarn={søkerdata.barn} formikProps={formikProps} />
                        )}
                        {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                            <AnnetBarnPart formikProps={formikProps} />
                        )}
                        {(hasChosenRegisteredChild ||
                            søknadenGjelderEtAnnetBarn === true ||
                            søkerdata.barn.length === 0 ||
                            values[AppFormField.sammeAdresse] !==
                                undefined) /** Do not hide if user has already answered */ && (
                            <>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<AppFormField>
                                        legend="Er du folkeregistrert på samme adresse som barnet?"
                                        name={AppFormField.sammeAdresse}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                            </>
                        )}
                    </>
                )}
            </SøkerdataContextConsumer>
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
