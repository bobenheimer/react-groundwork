const path = require('path');
const appConfig = require('../config');
const assetPath = path.join(appConfig.publicPath, 'dist');
const isDev = (process.env.NODE_ENV === 'development');
const title = 'hello, world';

module.exports = function () {
  // Since every time we rebuild with webpack new bundle files get generated,
  // we need to clear the previous manifest that was imported.
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/manifest.json')];
  }

  const manifest = require('../../dist/manifest.json');

  // In dev mode we use style tags instead of writing a new css file to speed up rebuilds
  const stylesheet = isDev ? '' : `<link rel='stylesheet' href='${manifest['app.css']}'>`;

  return (
`<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    ${stylesheet}
    <script src='${assetPath}/${manifest['vendor.js']}'></script>
  </head>
  <body>
    <div id='app'></div>
    <script src='${assetPath}/${manifest['app.js']}'></script>
  </body>
</html>`
  );
};