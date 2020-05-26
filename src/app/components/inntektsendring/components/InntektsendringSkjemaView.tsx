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
import { getInntektsendringSkjemaByArbeidstype, harPerioderMedHopp } from '../utils';
import EndringsradView from './EndringsradView';
import NyEndringView from './NyEndringView';
import { Panel } from 'nav-frontend-paneler';
import 'nav-frontend-tabell-style';
import Box from 'common/components/box/Box';
import { Element as NavElement } from 'nav-frontend-typografi';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

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

    const skalInkludereSkjema: boolean = harPerioderMedHopp(perioderMedFravær, dagerMedDelvisFravær);

    return skalInkludereSkjema ? (
        <div>
            <InntektsendringYesOrNoQuestion formikName={yesOrNoFormikName(formikInntektsgruppeRootName, arbeidstype)} />

            {skjema[InntektsendringSkjemaFields.harHattEndring] === YesOrNo.YES && (
                <FormBlock>
                    <FieldArray
                        name={endringslisteFormikName(formikInntektsgruppeRootName, arbeidstype)}
                        render={(arrayHelpers: ArrayHelpers) => {
                            const handleSaveEndring = (endring: Endring, index: number): void => {
                                arrayHelpers.replace(index, endring);
                            };

                            const handleDeleteEndring = (index: number): void => {
                                arrayHelpers.remove<Endring>(index);
                            };

                            return (
                                <Panel>
                                    <Box padBottom={'l'}>
                                        <Box padBottom={'s'}>
                                            <NavElement>Endringer</NavElement>
                                        </Box>
                                        <ol className={'inntektsendring-list'}>
                                            {endringer.map(
                                                (endring: Endring, index: number): JSX.Element => (
                                                    <EndringsradView
                                                        key={`endringsrad-${index}`}
                                                        endring={endring}
                                                        onSaveEditedEndring={(endringToSave) =>
                                                            handleSaveEndring(endringToSave, index)
                                                        }
                                                        onDeleteEndring={() => handleDeleteEndring(index)}
                                                    />
                                                )
                                            )}
                                        </ol>
                                    </Box>
                                    <Box>
                                        <NyEndringView
                                            onSaveNewEndring={(endring: Endring) => {
                                                arrayHelpers.insert(endringer.length, endring);
                                            }}
                                        />
                                    </Box>
                                </Panel>
                            );
                        }}
                    />
                </FormBlock>
            )}
        </div>
    ) : null;
};

export default InntektsendringSkjemaView;
