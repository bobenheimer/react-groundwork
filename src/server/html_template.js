const appConfig = require('../config');
const manifest = require('../../dist/manifest.json');

const { publicPath } = appConfig;
const isDev = (process.env.NODE_ENV === 'development');
const title = 'hello, world';

module.exports = function () {
  // In dev mode we use style tags instead of writing a new css file to speed up rebuilds
  const stylesheet = isDev ? '' : `<link rel='stylesheet' href='${publicPath}${manifest['app.css']}'>`;

  return (
`<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    ${stylesheet}
    <script src='${publicPath}${manifest['vendor.js']}'></script>
  </head>
  <body>
    <div id='app'></div>
    <script src='${publicPath}${manifest['app.js']}'></script>
  </body>
</html>`
  );
};