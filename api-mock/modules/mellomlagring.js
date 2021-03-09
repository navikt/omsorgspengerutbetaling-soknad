const os = require("os");
const Utils = require("../utils/utils");

const MELLOMLAGRING_JSON = `${os.tmpdir()}/tempStorageOmsorgspengerutbetaling.json`;

console.log(MELLOMLAGRING_JSON);

module.exports.get = async (req, res) => {
  const exists = await Utils.existsAsync(MELLOMLAGRING_JSON);
  if (exists) {
    const json = await Utils.readJsonAndParseAsync(MELLOMLAGRING_JSON);
    res.json(json);
  } else {
    res.send({});
  }
};
module.exports.post = async (req, res) => {
  const body = req.body;
  const jsBody = Utils.isJSON(body) ? JSON.parse(body) : body;
  Utils.writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
  res.sendStatus(200);
};
module.exports.put = async (req, res) => {
  const body = req.body;
  const jsBody = Utils.isJSON(body) ? JSON.parse(body) : body;
  Utils.writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
  res.sendStatus(200);
};

module.exports.del = async (req, res) => {
  Utils.writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
  res.sendStatus(200);
};
