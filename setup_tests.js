const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const jsdom = require('jsdom');

// JSDOM
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

// ENZYME
configure({ adapter: new Adapter() });
