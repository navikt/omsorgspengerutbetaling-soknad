import React from 'react';
import {
    FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels
} from '@navikt/sif-common-formik';
import { Fosterbarn } from '../../../types/SøknadFormData';
import FosterbarnForm from './FosterbarnForm';
import FosterbarnList from './FosterbarnList';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    labels: ModalFormAndListLabels;
}

function FosterbarnListAndDialog<FieldNames>({ name, validate, labels }: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, Fosterbarn>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FosterbarnForm fosterbarn={item} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FosterbarnList fosterbarn={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default FosterbarnListAndDialog;
