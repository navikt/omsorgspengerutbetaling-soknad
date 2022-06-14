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
router.get('/oppslag/barn', Barn.get);
router.get('/oppslag/soker', Soker.get);
router.get('/oppslag/soker-umyndig', Soker.getUmyndig);
router.post('/omsorgspenger-utbetaling-snf/innsending', Soknad.post);
router.post('/vedlegg', Vedlegg.post);
router.get('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', Mellomlagring.get);
router.post('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', Mellomlagring.post);
router.put('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', Mellomlagring.put);
router.delete('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', Mellomlagring.del);

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080'];
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
    console.log(`Express mock-api server listening on port: http://${host}:${port}`);
});

module.exports = server;
