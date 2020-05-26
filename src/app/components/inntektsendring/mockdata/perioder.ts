import {FraværDelerAvDag, Periode} from "../../../../@types/omsorgspengerutbetaling-schema";


const fraværDelerAvDag20200101Onsdag: FraværDelerAvDag = {
    dato: new Date('2020-01-01'),
    timer: 1
};
const fraværDelerAvDag20200102Torsdag: FraværDelerAvDag = {
    dato: new Date('2020-01-02'),
    timer: 1
};
const fraværDelerAvDag20200103Fredag: FraværDelerAvDag = {
    dato: new Date('2020-01-03'),
    timer: 1
};
const fraværDelerAvDag20200104Lørdag: FraværDelerAvDag = {
    dato: new Date('2020-01-04'),
    timer: 1
};
const fraværDelerAvDag20200105Søndag: FraværDelerAvDag = {
    dato: new Date('2020-01-05'),
    timer: 1
};
const fraværDelerAvDag20200106Mandag: FraværDelerAvDag = {
    dato: new Date('2020-01-06'),
    timer: 1
};
const fraværDelerAvDag20200107Tirsdag: FraværDelerAvDag = {
    dato: new Date('2020-01-07'),
    timer: 1
};


const periodeFom20200101OnsdagTom20200101Onsdag: Periode = {
    fom: new Date('2020-01-01'),
    tom: new Date('2020-01-01')
};
const periodeFom20200101OnsdagTom20200103Fredag: Periode = {
    fom: new Date('2020-01-01'),
    tom: new Date('2020-01-03')
};
const periodeFom20200101OnsdagTom20200106Mandag: Periode = {
    fom: new Date('2020-01-01'),
    tom: new Date('2020-01-03')
};
const periodeFom20200101OnsdagTom20200107Tirsdag: Periode = {
    fom: new Date('2020-01-01'),
    tom: new Date('2020-01-03')
};


const tomListeAvFraværDelerAvDag: FraværDelerAvDag[] = [];
const etEllementListeAvFraværDelerAvDag: FraværDelerAvDag[] = [fraværDelerAvDag20200101];
const listeAvFraværDelerAvDag: FraværDelerAvDag[] = [];

const listeAvPeriode: Periode[] = [];
