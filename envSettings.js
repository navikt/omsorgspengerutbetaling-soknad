const process = require('process');
require('dotenv').config();

const envSettings = () => {
    const API_URL = process.env.API_URL;
    const FRONTEND_API_PATH = process.env.FRONTEND_API_PATH;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const LOGIN_URL = process.env.LOGIN_URL;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;
    const MELLOMLAGRING = process.env.MELLOMLAGRING;
    const STENGT_BHG_SKOLE = process.env.STENGT_BHG_SKOLE;
    const NYNORSK = process.env.NYNORSK;
    const APPSTATUS_PROJECT_ID = process.env.APPSTATUS_PROJECT_ID;
    const APPSTATUS_DATASET = process.env.APPSTATUS_DATASET;
    const SKIP_ORGNUM_VALIDATION = process.env.SKIP_ORGNUM_VALIDATION;

    const appSettings = `
     window.appSettings = {
         API_URL: '${API_URL}',
         FRONTEND_API_PATH: '${FRONTEND_API_PATH}',
         PUBLIC_PATH: '${PUBLIC_PATH}',
         LOGIN_URL: '${LOGIN_URL}',
         UTILGJENGELIG: '${UTILGJENGELIG}',
         MELLOMLAGRING: '${MELLOMLAGRING}',
         STENGT_BHG_SKOLE: '${STENGT_BHG_SKOLE}',
         NYNORSK: '${NYNORSK}',
         APPSTATUS_PROJECT_ID: '${APPSTATUS_PROJECT_ID}',
         APPSTATUS_DATASET: '${APPSTATUS_DATASET}',
         SKIP_ORGNUM_VALIDATION: '${SKIP_ORGNUM_VALIDATION}',
     };`
        .trim()
        .replace(/ /g, '');

    try {
        return appSettings;
    } catch (e) {
        console.error(e);
    }
};

module.exports = envSettings;
