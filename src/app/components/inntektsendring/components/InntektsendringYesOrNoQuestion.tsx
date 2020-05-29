import * as React from 'react';
import FormBlock from "common/components/form-block/FormBlock";
import {FormikYesOrNoQuestion} from "@navikt/sif-common-formik/lib";
import intlHelper from "common/utils/intlUtils";
import {useIntl} from "react-intl";
import {YesOrNo} from "common/types/YesOrNo";
import {Endring} from "../types";
import {FieldValidationResult} from "common/validation/types";
import {AppFieldValidationErrors, createAppFieldValidationError} from "../../../validation/fieldValidations";

interface Props {
    formikName: string;
    endringer: Endring[];
}

export const validateInntektsendring = (yesOrNo: YesOrNo, endringer: Endring[]): FieldValidationResult => {
    if (yesOrNo === YesOrNo.UNANSWERED) {
        return createAppFieldValidationError(AppFieldValidationErrors.påkrevd)
    }
    if (yesOrNo === YesOrNo.YES && endringer.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.ingen_endringer_spesifisert)
    }
    return undefined;
};

const InntektsendringYesOrNoQuestion: React.FC<Props> = ({formikName, endringer}: Props) => {
    const intl = useIntl();
    return (
        <FormBlock>
            <FormikYesOrNoQuestion
                name={formikName}
                legend={intlHelper(intl, 'inntektsendring.yesorno.spm')}
                validate={(yesNoQuestion: YesOrNo) => validateInntektsendring(yesNoQuestion, endringer)}
            />
        </FormBlock>
    )
};

export default InntektsendringYesOrNoQuestion;
