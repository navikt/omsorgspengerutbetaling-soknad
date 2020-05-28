import {FraværDelerAvDag, Periode} from "../../../../@types/omsorgspengerutbetaling-schema";


export const fraværDelerAvDag20200101Onsdag: FraværDelerAvDag = {
    dato: new Date('2020-01-01'),
    timer: 1
};
export const fraværDelerAvDag20200102Torsdag: FraværDelerAvDag = {
    dato: new Date('2020-01-02'),
    timer: 1
};
export const fraværDelerAvDag20200103Fredag: FraværDelerAvDag = {
    dato: new Date('2020-01-03'),
    timer: 1
};
export const fraværDelerAvDag20200104Lørdag: FraværDelerAvDag = {
    dato: new Date('2020-01-04'),
    timer: 1
};
export const fraværDelerAvDag20200105Søndag: FraværDelerAvDag = {
    dato: new Date('2020-01-05'),
    timer: 1
};
export const fraværDelerAvDag20200106Mandag: FraværDelerAvDag = {
    dato: new Date('2020-01-06'),
    timer: 1
};
export const fraværDelerAvDag20200107Tirsdag: FraværDelerAvDag = {
    dato: new Date('2020-01-07'),
    timer: 1
};


export const periode0501Fredag0505Tirsdag: Periode = {
    fom: new Date('2020-05-01'),
    tom: new Date('2020-05-05')
};
export const periode0506Onsdag0510Søndag: Periode = {
    fom: new Date('2020-05-06'),
    tom: new Date('2020-05-10')
};
export const periode0511Mandag0531Søndag: Periode = {
    fom: new Date('2020-05-11'),
    tom: new Date('2020-05-31')
};
export const periode0601Mandag0607Søndag: Periode = {
    fom: new Date('2020-06-01'),
    tom: new Date('2020-06-07')
};

export const periode0506Onsdag0508Fredag: Periode = {
    fom: new Date('2020-05-06'),
    tom: new Date('2020-05-08')
};

export const godBlandingPerioder: Periode[] = [
    periode0501Fredag0505Tirsdag,
    periode0506Onsdag0510Søndag,
    periode0511Mandag0531Søndag,
    periode0601Mandag0607Søndag
];
export const godBlandingDager: FraværDelerAvDag[] = [
    {dato: new Date('2020-05-06'), timer: 1},
    {dato: new Date('2020-05-07'), timer: 1},
    {dato: new Date('2020-05-08'), timer: 1},
    {dato: new Date('2020-05-09'), timer: 1},
    {dato: new Date('2020-05-010'), timer: 1}
];

export const mangeConnectedPerioder: Periode[] = [
    periode0501Fredag0505Tirsdag,
    periode0506Onsdag0510Søndag,
    periode0511Mandag0531Søndag,
    periode0601Mandag0607Søndag
];

export const mangePerioderMedEtHull: Periode[] = [
    periode0501Fredag0505Tirsdag,
    periode0511Mandag0531Søndag,
    periode0601Mandag0607Søndag
];

export const mangeConnectedPerioderMedHoppIEnHelg: Periode[] = [
    periode0501Fredag0505Tirsdag,
    periode0506Onsdag0508Fredag,
    periode0511Mandag0531Søndag,
    periode0601Mandag0607Søndag
];
