const os = require('os');
const fs = require('fs');
const express = require('express');
const busboyCons = require('busboy');

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080'];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-Request-Id', 'localhost-1234567890');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Expose-Headers', 'X-Request-Id');
    next();
});

const søkerMock = {
    aktørId: '1234567890',
    fornavn: 'Test',
    mellomnavn: null,
    etternavn: 'Testesen',
    fødselsnummer: '12345123456',
    fødselsdato: '2020-01-01',
};

const barnMock = {
    barn: [
        { fødselsdato: '2008-01-02', fornavn: 'Barn', mellomnavn: 'Barne', etternavn: 'Barnesen', aktørId: '1' },
        { fødselsdato: '2008-01-02', fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '2' },
    ],
};

const MELLOMLAGRING_JSON = `${os.tmpdir()}/omsorgspenger-utbetaling-arbeidstaker-mellomlagring.json`;

const isJSON = (str) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};
const writeFileAsync = async (path, text) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
const readFileSync = (path) => {
    return fs.readFileSync(path, 'utf8');
};
const existsSync = (path) => fs.existsSync(path);

const startServer = () => {
    const port = 8083;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/oppslag/soker', (req, res) => {
        res.send(søkerMock);
    });

    server.get('/oppslag/barn', (req, res) => {
        setTimeout(() => {
            res.send(barnMock);
        }, 200);
    });

    server.get('/oppslag/soker-umyndig', (req, res) => {
        res.send(451);
    });

    server.post('/vedlegg', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Location');
        res.set('Location', 'nav.no');
        const busboy = busboyCons({ headers: req.headers });
        busboy.on('finish', () => {
            res.writeHead(200, { Location: '/vedlegg' });
            res.end();
        });
        req.pipe(busboy);
    });

    server.get('/oppslag/barn', (req, res) => res.send(barnMock));

    server.post('/omsorgspenger-utbetaling-snf/innsending', (req, res) => {
        console.log(req.body);
        res.sendStatus(200);
    });

    server.get('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', (req, res) => {
        if (existsSync(MELLOMLAGRING_JSON)) {
            const body = readFileSync(MELLOMLAGRING_JSON);
            res.send(JSON.parse(body));
        } else {
            res.send({});
        }
    });
    server.post('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });
    server.put('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });
    server.delete('/mellomlagring/OMSORGSPENGER_UTBETALING_SNF', (req, res) => {
        // setTimeout(() => {
        //     writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        //     res.sendStatus(202);
        // }, 2000);
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        res.sendStatus(202);
    });

    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
};

startServer();
