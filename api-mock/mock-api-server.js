const express = require('express');

const Health = require('./modules/health');
const Mellomlagring = require('./modules/mellomlagring');
const Arbeidsgiver = require('./modules/arbeidsgiver');
const Barn = require('./modules/barn');
const Soker = require('./modules/soker');
const Soknad = require('./modules/soknad');
const Vedlegg = require('./modules/vedlegg');

const server = express();
const port = process.env.PORT || 8083;
const host = process.env.HOST || 'localhost';

const router = express.Router();

router.get('/health/isAlive', Health.isAlive);
router.get('/health/isReady', Health.isReady);
router.get('/arbeidsgiver', Arbeidsgiver.get);
router.get('/barn', Barn.get);
router.get('/soker', Soker.get);
router.post('/soknad', Soknad.post);
router.post('/vedlegg', Vedlegg.post);
router.get('/mellomlagring', Mellomlagring.get);
router.post('/mellomlagring', Mellomlagring.post);
router.put('/mellomlagring', Mellomlagring.put);
router.delete('/mellomlagring', Mellomlagring.del);

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['https://pleiepengesoknad-mock.nais.oera.no', 'http://localhost:8080'];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }
    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

server.use('/', router);

server.listen(port, () => {
    console.log(`App listening on: http://${host}:${port}`);
});

module.exports = server;
