const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                PUBLIC_PATH: '${process.env.PUBLIC_PATH}',
                UTILGJENGELIG: '${process.env.UTILGJENGELIG}',
                MELLOMLAGRING: '${process.env.MELLOMLAGRING}',
                STENGT_BHG_SKOLE: '${process.env.STENGT_BHG_SKOLE}',
                NYNORSK: '${process.env.NYNORSK}',
                APPSTATUS_PROJECT_ID: '${process.env.APPSTATUS_PROJECT_ID}',
                APPSTATUS_DATASET: '${process.env.APPSTATUS_DATASET}',
                SKIP_ORGNUM_VALIDATION: '${process.env.SKIP_ORGNUM_VALIDATION}',
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
