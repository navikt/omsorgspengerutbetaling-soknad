import {mangePerioderMedEtHull} from '../mockdata/perioder';
import {Periode} from '../../../../@types/omsorgspengerutbetaling-schema';
import {YesOrNo} from '@navikt/sif-common-formik/lib';
import {Virksomhet} from '@navikt/sif-common-forms/lib';
import {Arbeidstype, Endring, InntektsendringGruppe, InntektsendringSkjemaFields} from '../types';
import {inntektsendringGruppeIsValid} from '../inntektsendringValidation';

const perioderMedHopp: Periode[] = [...mangePerioderMedEtHull];
const erFrilans = YesOrNo.YES;
const virksomheter: Virksomhet[] = [];
const enDefinertEndring: Endring = {
    dato: new Date('2020-01-01'),
    forklaring: "En forklaring."
};
const invalidInntektsendringGruppe: InntektsendringGruppe = {
    [Arbeidstype.frilans]: {
        [InntektsendringSkjemaFields.harHattEndring]: YesOrNo.YES,
        [InntektsendringSkjemaFields.endringer]: []
    },
    [Arbeidstype.selvstendig]: {
        [InntektsendringSkjemaFields.harHattEndring]: YesOrNo.UNANSWERED,
        [InntektsendringSkjemaFields.endringer]: []
    }
};

describe('validates correctly', () => {
    it('is invalid', () => {

        expect(inntektsendringGruppeIsValid(invalidInntektsendringGruppe, perioderMedHopp, [], erFrilans, virksomheter)).toBe(
            false
        );
    });

    it('is valid', () => {

        const validInntektsgruppe: InntektsendringGruppe = {
            ...invalidInntektsendringGruppe,
            [Arbeidstype.frilans]: {
                ...invalidInntektsendringGruppe[Arbeidstype.frilans],
                [InntektsendringSkjemaFields.endringer]: [enDefinertEndring]
            }
        };

        expect(inntektsendringGruppeIsValid(validInntektsgruppe, perioderMedHopp, [], erFrilans, virksomheter)).toBe(
            true
        );
    });
});
