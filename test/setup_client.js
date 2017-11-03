const _ = require('lodash');
const context = require.context('../src', true, /\.test\.jsx?$/);

context.keys().forEach((filename) => {
  // Server tests are handled outside of this file
  if (!_.startsWith(filename, './server')) {
    context(filename)
  }
});
