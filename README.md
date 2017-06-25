# Alternate API for adding custom Jasmine matchers

This is a more declarative, and, I hope, easier to use API for writing custom Jasmime matchers.

## Documentation

Instead of this:
```javascript
// TODO
```

use this:
```javascript
let jenh = require('jasmine-add-matcher');
beforeEach(function () {
  jenh.addMatcher('toBeEven', "expected {actual} (NOT) to be even', (actual) => actual % 2 === 0);
});
it('works', function () {
  expect(3).toBeEven();
});
```
### More stuff

* {actual} and {expected} value interpolation in message
* with jasmine.pp or custom formatter
* 'abmidextrous message with (not) token embedded', or ['normal message', 'inverted message']

```javascript
interface API {
  matcher: function (
    name: string,
    messageTemplates: string | [string, string],
    checkFn: (actual: any, expected: any, util: Object, customEqualityTester: Object) => boolean,
    formatValueFn?: (actual: any, expected: any, util: Object, customEqualityTester: Object) => string = jasmine.pp
  );
  addMatcher: function (
    name: string,
    messageTemplates: string | [string, string],
    checkFn: (actual: any, expected: any, util: Object, customEqualityTester: Object) => boolean,
    formatValueFn?: (value: any, util: Object, customEqualityTester: Object) => string  = jasmine.pp
  );
}

```
### License

MIT
