const moment = require('moment');

const timestamp = moment();

const errorMessage = (status, error, message, path) => ({
  timestamp,
  status,
  error,
  message,
  path,
});
module.exports.errorMessage = errorMessage;

module.exports.noContent204 = (path = '/ukjent', message = 'No Content success status response code indicates that the request has succeeded, but that the client doesn\'t need to go away from its current page') => {
  console.log(path, message);
  return "";
};
module.exports.badRequest400 = (path, message = 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).') => {
  return errorMessage(400,
    'Bad Request',
    message,
    path);
};
module.exports.unauthorizedRequest401 = (path, message = 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.') => {
  return errorMessage(401, 'Unauthorized',
    message,
    path);
};
module.exports.forbiddenRequest403 = (path, message = 'The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.') => {
  return errorMessage(403, 'Unauthorized',
    message,
    path);
};
module.exports.notFound404 = (path, message = 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.') => {
  return errorMessage(404, 'Not Found',
    message,
    path);
};
module.exports.gone410 = (path, message = 'Gone: client error response code indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent') => {
  return errorMessage(410,
    'Gone',
    message,
    path);
};
module.exports.serverError500 = (path, message = 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.') => {
  return errorMessage(500, 'Internal Server Error',
    message,
    path);
};

module.exports.notAcceptable406 = (path, message = 'The target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields.') => {
  return errorMessage(406, 'Not Acceptable',
    message,
    path);
};
