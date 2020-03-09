import React from 'react';
import { useIntl } from 'react-intl';
import { Panel } from 'nav-frontend-paneler';
import Box from 'common/components/box/Box';
import VirksomhetListAndDialog from 'common/forms/virksomhet/VirksomhetListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikYesOrNoQuestion from "common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion";
import {AppFormField, OmsorgspengesøknadFormData} from "../../../types/OmsorgspengesøknadFormData";
import intlHelper from "common/utils/intlUtils";
import {validateRequiredList} from "common/validation/fieldValidations";

interface Props {
    formValues: OmsorgspengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues }) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <FormikYesOrNoQuestion<AppFormField>
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                />
            </Box>
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <Box margin="l">
                    <Panel>
                        <VirksomhetListAndDialog
                            name={AppFormField.selvstendig_virksomheter}
                            labels={{
                                listTitle: intlHelper(intl, 'selvstendig.list.tittel'),
                                addLabel: intlHelper(intl, 'selvstendig.list.leggTilLabel'),
                                modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel')
                            }}
                            validate={validateRequiredList}
                        />
                    </Panel>
                </Box>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
