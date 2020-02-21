import * as React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'formik';
import { flattenFieldArrayErrors, isValidationErrorsVisible } from '@navikt/sif-common/lib/common/formik/formikUtils';
import intlHelper from 'common/utils/intlUtils';
import { isFieldValidationError, renderFieldValidationError } from 'common/validation/fieldValidationRenderUtils';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';
import ValidationErrorSummaryBase, {
    ValidationSummaryError
} from '../validation-error-summary-base/ValidationErrorSummaryBase';

interface FormikValidationErrorSummaryProps {
    className?: string;
}

type Props = FormikValidationErrorSummaryProps & ConnectedFormikProps<AppFormField>;

const FormikValidationErrorSummary: React.FunctionComponent<Props> = ({ formik, className }) => {
    const intl = useIntl();
    if (formik === undefined) {
        return null;
    }
    const { errors, submitCount, status } = formik;
    if (errors) {
        const numberOfErrors = Object.keys(errors).length;
        const errorMessages: ValidationSummaryError[] = [];

        if (numberOfErrors > 0 && isValidationErrorsVisible(status, submitCount)) {
            const allErrors = flattenFieldArrayErrors(errors);
            Object.keys(allErrors).forEach((key) => {
                const error = allErrors[key];
                const message = isFieldValidationError(error) ? renderFieldValidationError(intl, error) : error;
                if (message && typeof message === 'string') {
                    errorMessages.push({
                        name: key,
                        message
                    });
                }
            });

            if (errorMessages.length === 0) {
                return null;
            }
            return (
                <ValidationErrorSummaryBase
                    className={className}
                    errors={errorMessages}
                    title={intlHelper(intl, 'formikValidationErrorSummary.tittel')}
                />
            );
        }
    }

    return null;
};

export default connect<FormikValidationErrorSummaryProps, AppFormField>(FormikValidationErrorSummary);
