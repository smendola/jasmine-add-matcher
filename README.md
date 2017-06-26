# Alternate API for adding custom Jasmine matchers

This is a more declarative, and, I hope, easier to use API for writing custom Jasmime matchers.

## Documentation

Instead of this:
```javascript
// TODO: show using the standard Jasmine API for creating a matcher
```

use this:
```javascript
let jenh = require('jasmine-add-matcher');
beforeEach(function () {
  jenh.addMatcher('toBeEven', 'expected {actual} (NOT) to be even', (actual) => actual % 2 === 0);
});
it('works', function () {
  expect(3).toBeEven();
});
```

### API

```typescript
type CheckFunction = (actual: any, expected: any, util: {}, customEqualityTesters: {}) => boolean
type FormatFunction = (actual: any, expected: any, util: {}, customEqualityTesters: {}) => string

declare function matcher(
  name: string,
  messageTemplates: string | [string, string],
  checkFn: CheckFunction,
  formatValueFn?: FormatFunction
): Matcher;

declare function addMatcher(
  name: string,
  messageTemplates: string | [string, string],
  checkFn: CheckFunction,
  formatValueFn?: FormatFunction
): void;

```

### Misc other features

* {actual} and {expected} value interpolation in message
* with jasmine.pp or custom formatter
* abmidextrous message with (not) token embedded',
* or ['normal message', 'inverted message']

### License

MIT
