const ERR = require('./errors');

module.exports.notFound = (req, res, message) => {
    const melding = ERR.notFound404(message);
    return res.status(404).send(melding);
};
/**
 * badRequestParam
 * @param req
 * @param res
 * @param message
 * @returns {*}
 */
const badRequestParam = (req, res, message) => {
    const melding = ERR.badRequest400(req.originalUrl, message);
    return res.status(400).send(melding);
};
module.exports.badRequestParam = badRequestParam;

/**
 * serverError
 * @param req
 * @param res
 * @param e
 * @returns {*}
 */
module.exports.serverError = (req, res, e) => {
    console.error(e);
    // TODO logger.error(e.message);
    const melding = ERR.serverError500(req.originalUrl, e.message);
    return res.status(500).send(melding);
};
