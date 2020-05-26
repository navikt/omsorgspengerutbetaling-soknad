import * as React from 'react';
import {validateYesOrNoIsAnswered} from "common/validation/fieldValidations";
import FormBlock from "common/components/form-block/FormBlock";
import {FormikYesOrNoQuestion} from "@navikt/sif-common-formik/lib";
import intlHelper from "common/utils/intlUtils";
import {useIntl} from "react-intl";

interface Props {
    formikName: string
}

const InntektsendringYesOrNoQuestion: React.FC<Props> = ({formikName}: Props) => {
    const intl = useIntl();
    return (
        <FormBlock>
            <FormikYesOrNoQuestion
                name={formikName}
                legend={intlHelper(intl, 'inntektsendring.yesorno.spm')}
                validate={validateYesOrNoIsAnswered}
            />
        </FormBlock>
    )
};

export default InntektsendringYesOrNoQuestion;
