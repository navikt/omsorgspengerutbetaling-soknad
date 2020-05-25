import * as React from 'react';
import InntektsendringYesOrNoQuestion from './InntektsendringYesOrNoQuestion';
import {
    Arbeidstype,
    Endring,
    InntektsendringGruppe,
    InntektsendringSkjema,
    InntektsendringSkjemaFields
} from '../types';
import { endringslisteFormikName, yesOrNoFormikName } from '../formikNameUtils';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { ArrayHelpers, FieldArray } from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import { getInntektsendringSkjemaByArbeidstype } from '../utils';
import EndringsradView from './EndringsradView';
import NyEndringView from './NyEndringView';

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
    const skjema: InntektsendringSkjema = getInntektsendringSkjemaByArbeidstype(inntektsendringGruppe, arbeidstype);
    const endringer = skjema[InntektsendringSkjemaFields.endringer];

    const skalInkludereSkjema: boolean = true; // TODO: Bruk perioder for å bestemme om det skal inkluderes

    return skalInkludereSkjema ? (
        <div>
            <InntektsendringYesOrNoQuestion formikName={yesOrNoFormikName(formikInntektsgruppeRootName, arbeidstype)} />

            <FormBlock>
                <FieldArray
                    name={endringslisteFormikName(formikInntektsgruppeRootName, arbeidstype)}
                    render={(arrayHelpers: ArrayHelpers) => {
                        const handleSaveEndring = (endring: Endring, index: number): void => {
                            arrayHelpers.handleReplace(index, endring);
                        };

                        const handleDeleteEndring = (index: number): void => {
                            arrayHelpers.remove<Endring>(index);
                        };

                        return (
                            <div>
                                Endringsliste:
                                {endringer.map(
                                    (endring: Endring, index: number): JSX.Element => {
                                        return (
                                            <EndringsradView
                                                key={`endringsrad-${index}`}
                                                endring={endring}
                                                onSaveEditedEndring={(endringToSave) => handleSaveEndring(endringToSave, index)}
                                                onDeleteEndring={() => handleDeleteEndring(index)}
                                            />
                                        );
                                    }
                                )}
                                NyEndringView:
                                <NyEndringView
                                    onSaveNewEndring={(endring: Endring) => {
                                        arrayHelpers.insert(endringer.length, endring);
                                    }}
                                />
                            </div>
                        );
                    }}
                />
            </FormBlock>
        </div>
    ) : null;
};

export default InntektsendringSkjemaView;
