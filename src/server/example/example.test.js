const expect = require('chai').expect;
const example = require('./example');

describe('Example server test', function () {
  it('example unit test', function () {
    expect(example()).to.equal(2);
  });
});
