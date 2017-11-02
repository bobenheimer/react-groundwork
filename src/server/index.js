const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const htmlTemplate = require('../html_template');
const appConfig = require('../config');

const app = express();
const baseRouter = express.Router();

// Important security plugin!
app.use(helmet());

// Gzip
app.use(compression());

// Serve static files
baseRouter.use('/dist', express.static(path.resolve(__dirname, '../../dist'), {}));

// Other routes should go here
// baseRouter.get('/foo');

// All uncaught routes go main page
baseRouter.get('*', function (req, res) {
  res.send(htmlTemplate());
});

// Use baseRouter prefixed with whatever the public path is
app.use(appConfig.publicPath, baseRouter);

// Listen on port
app.listen(appConfig.port);
