import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import {
    validateFødselsnummer, validateRequiredField
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import Tiles from '../../../components/tiles/Tiles';
import { Fosterbarn } from '../../../types/SøknadFormData';
import { isFosterbarn } from './types';

interface Props {
    fosterbarn?: Partial<Fosterbarn>;
    onSubmit: (values: Fosterbarn) => void;
    onCancel: () => void;
}

enum FosterbarnFormField {
    fødselsnummer = 'fødselsnummer',
    fornavn = 'fornavn',
    etternavn = 'etternavn'
}

type FormValues = Partial<Fosterbarn>;

const Form = getTypedFormComponents<FosterbarnFormField, FormValues>();

const FosterbarnForm: React.FunctionComponent<Props> = ({
    fosterbarn: initialValues = { fornavn: '', etternavn: '', fødselsnummer: '' },
    onSubmit,
    onCancel
}) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFosterbarn(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('Fosterbarn skjema: Formvalues is not a valid Fosterbarn on submit.');
        }
    };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={() => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">Fosterbarn</Systemtittel>
                        <FormBlock>
                            <Form.Input
                                name={FosterbarnFormField.fødselsnummer}
                                label="Fødselsnummer"
                                validate={validateFødselsnummer}
                                inputMode="numeric"
                                maxLength={11}
                                style={{ width: '11rem' }}
                            />
                        </FormBlock>

                        <Tiles columns={2}>
                            <FormBlock>
                                <Form.Input
                                    name={FosterbarnFormField.fornavn}
                                    label="Fornavn"
                                    validate={validateRequiredField}
                                />
                            </FormBlock>
                            <FormBlock>
                                <Form.Input
                                    name={FosterbarnFormField.etternavn}
                                    label="Etternavn"
                                    validate={validateRequiredField}
                                />
                            </FormBlock>
                        </Tiles>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default FosterbarnForm;
