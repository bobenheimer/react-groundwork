const jsdom = require('jsdom');
const { window } = new jsdom.JSDOM('');

global.window = window;

Object.keys(window).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = window[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
