import * as React from 'react';
import {validateYesOrNoIsAnswered} from "common/validation/fieldValidations";
import FormBlock from "common/components/form-block/FormBlock";
import {FormikYesOrNoQuestion} from "@navikt/sif-common-formik/lib";

interface Props {
    formikName: string
}

const InntektsendringYesOrNoQuestion: React.FC<Props> = ({formikName}: Props) => {
    return (
        <FormBlock>
            <FormikYesOrNoQuestion
                name={formikName}
                legend="Har du hatt hele dager med fravær fra jobb?"
                validate={validateYesOrNoIsAnswered}
            />
        </FormBlock>
    )
};

export default InntektsendringYesOrNoQuestion;
