import { expect } from'chai'
import htmlTemplate from './html_template'

describe('Server tests', () => {
  describe('htmlTemplate', () => {
    it('Returns expected html', () => {
      const reset = htmlTemplate.__Rewire__('manifest', {
        'app.css': 'test_app.css',
        'vendor.js': 'test_vendor.js',
        'app.js': 'test_app.js'
      });

      expect(htmlTemplate()).to.equal(
`<!DOCTYPE html>
<html>
  <head>
    <title>hello, world</title>
    <link rel='stylesheet' href='/dist/test_app.css'>
    <script src='/dist/test_vendor.js'></script>
  </head>
  <body>
    <div id='app'></div>
    <script src='/dist/test_app.js'></script>
  </body>
</html>`
      );

      reset();
    })
  })
});
