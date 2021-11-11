const MockConfig = require('../mock.config');
const Utils = require('../utils/utils');

const path = `${MockConfig.MOCK_DATA_DIR}/soker.json5`;

module.exports.get = async (req, res) => {
    const json = await Utils.readJsonAndParseAsync(path);
    res.json(json);
};
module.exports.getUmyndig = async (req, res) => {
    res.send(451);
};
