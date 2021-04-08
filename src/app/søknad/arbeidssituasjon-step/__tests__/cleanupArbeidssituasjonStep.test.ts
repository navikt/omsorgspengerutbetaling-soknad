import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Næringstype } from '@navikt/sif-common-forms/lib';
import {
    FrilansFormData,
    initialValues,
    SelvstendigFormData,
    SøknadFormData,
    SøknadFormField,
} from '../../../types/SøknadFormData';
import { cleanupArbeidssituasjonStep } from '../cleanupArbeidssituasjonStep';

describe('cleanupArbeidssituasjonStep', () => {
    const frilansData: FrilansFormData = {
        frilans_erFrilanser: YesOrNo.YES,
        frilans_jobberFortsattSomFrilans: YesOrNo.YES,
        frilans_sluttdato: undefined,
        frilans_startdato: '2020-10-10',
    };
    const snData: SelvstendigFormData = {
        selvstendig_virksomheter: [
            {
                fom: new Date(),
                harRegnskapsfører: YesOrNo.NO,
                navnPåVirksomheten: 'abc',
                næringstyper: [Næringstype.ANNEN],
                registrertINorge: YesOrNo.YES,
            },
        ],
        selvstendig_erSelvstendigNæringsdrivende: YesOrNo.YES,
        selvstendig_harFlereVirksomheter: YesOrNo.NO,
    };
    const formData: SøknadFormData = { ...initialValues, ...snData, ...frilansData };

    it(`removes frilanser info if ${SøknadFormField.frilans_erFrilanser} === ${YesOrNo.NO}`, () => {
        const values: SøknadFormData = { ...formData, frilans_erFrilanser: YesOrNo.NO };
        const result = cleanupArbeidssituasjonStep(values);
        expect(result.frilans_jobberFortsattSomFrilans).toBeUndefined();
        expect(result.frilans_startdato).toBeUndefined();
        expect(result.frilans_startdato).toBeUndefined();
    });
    it(`retains frilanser info if ${SøknadFormField.frilans_erFrilanser} === ${YesOrNo.YES}`, () => {
        const values: SøknadFormData = { ...formData, frilans_erFrilanser: YesOrNo.YES };
        const result = cleanupArbeidssituasjonStep(values);
        expect(result.frilans_jobberFortsattSomFrilans).toBeDefined();
        expect(result.frilans_startdato).toBeDefined();
        expect(result.frilans_startdato).toBeDefined();
    });
    it(`removes selvstendig info if ${SøknadFormField.selvstendig_erSelvstendigNæringsdrivende} === ${YesOrNo.NO}`, () => {
        const values: SøknadFormData = { ...formData, selvstendig_erSelvstendigNæringsdrivende: YesOrNo.NO };
        const result = cleanupArbeidssituasjonStep(values);
        expect(result.selvstendig_harFlereVirksomheter).toBeUndefined();
        expect(result.selvstendig_virksomheter).toBeUndefined();
    });
    it(`retains selvstendig info if ${SøknadFormField.selvstendig_erSelvstendigNæringsdrivende} === ${YesOrNo.YES}`, () => {
        const values: SøknadFormData = { ...formData, selvstendig_erSelvstendigNæringsdrivende: YesOrNo.YES };
        const result = cleanupArbeidssituasjonStep(values);
        expect(result.selvstendig_harFlereVirksomheter).toBeDefined();
        expect(result.selvstendig_virksomheter).toBeDefined();
    });
});
