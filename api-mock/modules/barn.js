const barnMock = {
    barn: [
        { fødselsdato: '2008-01-02', fornavn: 'Barn', mellomnavn: 'Barne', etternavn: 'Barnesen', aktørId: '1' },
        { fødselsdato: '2008-01-02', fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '2' },
    ],
};

module.exports.get = (req, res) => {
    res.send(barnMock);
};
