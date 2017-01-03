const path = require('path');
const appConfig = require('./config');
const assetPath = path.join(appConfig.publicPath, 'dist');

const title = 'hello, world';

module.exports = function () {
  // Since every time we rebuild with webpack new bundle files get generated,
  // we need to clear the previous manifest that was imported.
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../dist/manifest.json')];
  }

  const manifest = require('../dist/manifest.json');

  return (
`<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel='stylesheet' href='${assetPath}/${manifest['app.css']}'>
    <script src='${assetPath}/${manifest['vendor.js']}'></script>
  </head>
  <body>
    <div id='app'></div>
    <script src='${assetPath}/${manifest['app.js']}'></script>
  </body>
</html>`
  );
};