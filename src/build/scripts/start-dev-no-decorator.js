const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/webpack.config.dev');
const configureDevServer = require('../webpack/devserver.config');

require('dotenv').config();

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, configureDevServer({}));

let PORT = 8080;
server.listen(PORT, '127.0.0.1', () => console.log(`Started server on http://localhost:${PORT}`));
