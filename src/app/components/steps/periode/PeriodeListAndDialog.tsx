import React from 'react';
import {sortItemsByFom} from '@navikt/sif-common-core/lib/utils/dateUtils';
import {FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels} from '@navikt/sif-common-formik';
import {Periode} from "../../../../@types/omsorgspengerutbetaling-schema";
import PeriodeList from "./PeriodeList";
import PeriodeForm from "./PeriodeForm";

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
}

function PeriodeListAndDialog<FieldNames>({ name, minDate, maxDate, validate, labels }: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, Periode>
                name={name}
                labels={labels}
                validate={validate}
                dialogWidth="narrow"
                sortFunc={sortItemsByFom}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <PeriodeForm
                        periode={item}
                        minDate={minDate}
                        maxDate={maxDate}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <PeriodeList perioder={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default PeriodeListAndDialog;
