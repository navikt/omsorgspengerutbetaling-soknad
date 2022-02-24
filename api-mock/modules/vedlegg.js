const busboyCons = require('busboy');

module.exports.post = async (req, res) => {
    res.set('Access-Control-Expose-Headers', 'Location');
    res.set('Location', 'nav.no');
    const busboy = busboyCons({ headers: req.headers });
    busboy.on('finish', () => {
        res.writeHead(200, { Location: '/vedlegg' });
        res.end();
    });
    req.pipe(busboy);
};
