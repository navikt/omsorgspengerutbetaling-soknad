import * as React from 'react';
import { useState } from 'react';
import InntektsendringYesOrNoQuestion from './InntektsendringYesOrNoQuestion';
import {
    Arbeidstype,
    Endring,
    InntektsendringGruppe,
    InntektsendringSkjema,
    InntektsendringSkjemaFields
} from '../types';
import {endringslisteFormikName, yesOrNoFormikName} from '../formikNameUtils';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import EndringsModal from './EndringsModal';
import { ArrayHelpers, FieldArray } from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import { getInntektsendringSkjemaByArbeidstype } from '../utils';

interface Props {
    formikInntektsgruppeRootName: string;
    inntektsendringGruppe: InntektsendringGruppe;
    arbeidstype: Arbeidstype;
    perioderMedFravær: Periode[];
    dagerMedDelvisFravær: FraværDelerAvDag[];
}

const InntektsendringSkjemaView: React.FC<Props> = ({
    formikInntektsgruppeRootName,
    inntektsendringGruppe,
    arbeidstype,
    perioderMedFravær,
    dagerMedDelvisFravær
}: Props): JSX.Element | null => {
    const [endringToEdit, setEndringToEdit] = useState<Endring | undefined>(undefined);
    const [endringsmodalIsOpen, setEndringsmodalIsOpen] = useState<boolean>(false);
    const skjema: InntektsendringSkjema = getInntektsendringSkjemaByArbeidstype(inntektsendringGruppe, arbeidstype);
    const endringer = skjema[InntektsendringSkjemaFields.endringer];

    const skalInkludereSkjema: boolean = true;

    const handleModalClose = (): void => {
        setEndringToEdit(undefined);
        setEndringsmodalIsOpen(false);
    };

    const handleSaveEndring = (endring: Endring): void => {};

    return skalInkludereSkjema ? (
        <div>
            <InntektsendringYesOrNoQuestion formikName={yesOrNoFormikName(formikInntektsgruppeRootName, arbeidstype)} />

            <FormBlock>
                <FieldArray
                    name={endringslisteFormikName(formikInntektsgruppeRootName, arbeidstype)}
                    render={(arrayHelpers: ArrayHelpers) => {
                        return (
                            <div>
                                {endringer.map(
                                    (endring: Endring): JSX.Element => {
                                        return <div>asdf</div>;
                                    }
                                )}
                            </div>
                        );
                    }}
                />
            </FormBlock>

            <EndringsModal
                saveEndring={(endring: Endring) => handleSaveEndring(endring)}
                maybeEndring={endringToEdit}
                isOpen={endringsmodalIsOpen}
                onRequestClose={handleModalClose}
            />
        </div>
    ) : null;
};

export default InntektsendringSkjemaView;
